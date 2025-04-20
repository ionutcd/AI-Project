const Userquery = require("../../../models/UserQuery");
const Chatbot = require("../../../models/Chatbot");
const Prompt = require("../../../models/Prompt");
const LLMOption = require("../../../models/LLMOption");
const { Anthropic, OpenAI } = require("llamaindex");
const OpenAIApi = require("openai");

const { activePrompt, allPrompts } = require("../../../prompts");
const e = require("cors");

let indexStore = [];
let serverInfo = { restarted: true };
let solution = null;

const whichModel = (model_name) => {
  // Check if it's a string, has some length, and starts with 'sk'
  if (typeof model_name === "string" && model_name.length > 0) {
    if (model_name.startsWith("gpt")) {
      return 1;
    } else if (model_name.startsWith("claude")) {
      return 2;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const getAndPrintUserChats = async (userId, isBot = false) => {
  try {
    const userQuery = isBot
      ? await Userquery.findOne({ bot_id: userId }).exec()
      : await Userquery.findOne({ user_id: userId }).exec();
    if (!userQuery) {
      console.log("No user found with that ID");
      return "";
    }

    const chats = userQuery?.chats;
    if (!chats) {
      console.log("No chats found for this user");
      return "";
    }

    const chatsJson = JSON.stringify(chats);

    // Parse the JSON data and collect questions and solutions
    const chatData = JSON.parse(chatsJson);
    const questionsAndSolutions = [];

    if (chatData && chatData.system && Array.isArray(chatData.system)) {
      chatData.system.forEach((chat) => {
        if (chat.queries && Array.isArray(chat.queries)) {
          chat.queries.forEach((query) => {
            questionsAndSolutions.push({
              question: query.question,
              solution: query.solution,
            });
          });
        }
      });
    } else {
      console.log("Invalid JSON data format.");
    }

    // Return the chat history as a string
    return questionsAndSolutions
      .map((qs) => `Question: ${qs.question}\nSolution: ${qs.solution}`)
      .join("\n\n");
  } catch (error) {
    console.error("Error fetching chats:", error);
    return "";
  }
};

const Chat = async (req, res, chatHistory) => {
  const req_time = Date.now();
  const { id = 0, question, title, isNew, isBubble } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (isNew && !title) {
    return res.status(400).json({ error: "Please provide chat title" });
  }

  let bot_id;
  let user_id;
  let userIndex = null;
  let solution = "";

  if (isBubble) {
    bot_id = req.token._id;
    const chatbot = await Chatbot.findById(bot_id);
    userIndex = indexStore.find((item) => item.app == chatbot.app_id);
  } else {
    user_id = req.token._id;
    userIndex = indexStore.find((item) => item.user == user_id);
  }
  if (!userIndex) {
    solution = isBubble
      ? await directGptQueryForBot(question, bot_id, chatHistory)
      : await directGptQuery(question, user_id, chatHistory);
    if (solution === "") {
      return res.status(400).json({ error: "Invaild LLM or LLM key" });
    }
  } else {
    const queryEngine = userIndex.index.asQueryEngine();
    const response = await queryEngine.query({ query: question });
    solution = response.toString();
  }

  try {
    const condition = isBubble ? { bot_id } : { user_id };
    const empty_value = isBubble
      ? {
          bot_id,
          chats: null,
        }
      : {
          user_id,
          chats: null,
        };
    const userQuery = (await Userquery.findOne(condition)) || empty_value;
    let activePromptChats;
    if (userQuery) {
      activePromptChats = userQuery.chats ? userQuery.chats[activePrompt] : [];
    } else {
      activePromptChats = [];
    }
    activePromptChats = !activePromptChats ? [] : activePromptChats;
    const res_time = Date.now();
    if (isNew) {
      const newChatId = activePromptChats.length
        ? activePromptChats[activePromptChats.length - 1].id + 1
        : 1;
      const newChat = {
        id: newChatId,
        title,
        queries: [{ question_id: 1, question, solution, req_time, res_time }],
      };
      activePromptChats.push(newChat);
      // userQuery = { ...userQuery, ["chat"]: null };
      // userQuery = { ...userQuery, ["user_id"]: req.token._id };
      userQuery.chats = {
        ...userQuery.chats,
        [activePrompt]: activePromptChats,
      };
      userQuery.chats[activePrompt] = activePromptChats;
    } else {
      const myChat = activePromptChats.find((chat) => chat.id == id);
      if (myChat) {
        const quesriesLength = myChat.queries.length;
        const newQuestionId = quesriesLength
          ? myChat.queries[quesriesLength - 1].question_id + 1
          : 1;
        myChat.queries = [
          ...myChat.queries,
          {
            question_id: newQuestionId,
            question,
            solution,
            req_time,
            res_time,
          },
        ];
      } else {
        return res.status(400).send("No record found with this chat id");
      }
    }
    const newUserQuery = new Userquery(userQuery);
    const result = await newUserQuery.save();
    solution = null;
    res.status(200).send({ chats: result.chats[activePrompt] });
  } catch (error) {
    solution = null;
    res.status(501).send(error.message);
    console.log("catch block error in chatting", error.message);
  }
};

const prompt = allPrompts.find((prompt) => prompt.title == "system");

const directGptQuery = async (question, user_id, chatHistory) => {
  let chatHistoryString;
  try {
    chatHistoryString = await getAndPrintUserChats(user_id);
  } catch (error) {
    console.error("Error fetching or printing chats:", error);
    return null;
  }

  try {
    const userPrompt = await Prompt.findOne({ user_id });
    let system_content, user_content;
    if (userPrompt) {
      system_content =
        userPrompt.detail && userPrompt.detail !== ""
          ? userPrompt.detail
          : prompt.description;
      user_content =
        userPrompt.detail && userPrompt.detail !== ""
          ? question + userPrompt.detail
          : question;
    } else {
      system_content = prompt.description;
      user_content = question;
    }

    const llmOption = await LLMOption.findOne({ user_id });
    const which_llm = llmOption && whichModel(llmOption?.gpt_name);

    if (which_llm === 2) {
      const claude = new Anthropic({
        apiKey:
          !llmOption?.llm_key || llmOption?.llm_key === ""
            ? process.env.CLAUDE_API_KEY
            : llmOption.llm_key,
        model:
          !llmOption?.gpt_name || llmOption?.gpt_name === ""
            ? process.env.CLAUDE_MODEL_NAME
            : llmOption.gpt_name,
      });

      const query = [
        {
          role: "system",
          content:
            "Here is your task: " +
            system_content +
            " Here is the chat history (make sure that you do not leak the history to the user): \n" +
            chatHistoryString,
        },
        { role: "user", content: user_content },
      ];

      const res = await claude.chat({ messages: query });
      return res.message.content;
    } else {
      const openai = new OpenAIApi({
        apiKey:
          !llmOption?.llm_key || llmOption?.llm_key === ""
            ? process.env.OPENAI_API_KEY
            : llmOption.llm_key,
      });

      const query = [
        {
          role: "system",
          content: "Here is your task: " + system_content,
          // + " Here is the chat history (make sure that you do not leak the history to the user): \n" +
          // chatHistoryString,
        },
        { role: "user", content: user_content },
      ];

      const GPTOutput = await openai.chat.completions.create({
        model:
          !llmOption?.gpt_name || llmOption?.gpt_name === ""
            ? process.env.GPT_DEFAULT_NAME
            : llmOption.gpt_name,
        messages: query,
      });

      return GPTOutput.choices[0].message.content;
    }
  } catch (e) {
    console.log("Invaid LLM or Key------", e);
    return null;
  }
  // return "I can do this";
};

const directGptQueryForBot = async (question, bot_id, chatHistory) => {
  let chatHistoryString;
  try {
    chatHistoryString = await getAndPrintUserChats(bot_id, true);
  } catch (error) {
    console.error("Error fetching or printing chats:", error);
    return null;
  }

  try {
    const chatbot = await Chatbot.findById(bot_id);
    let system_content, user_content;
    if (chatbot?.prompt) {
      system_content =
        chatbot.prompt !== "" ? chatbot?.prompt : prompt.description;
      user_content =
        chatbot.prompt !== "" ? question + chatbot.prompt : question;
    } else {
      system_content = prompt.description;
      user_content = question;
    }

    const openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const query = [
      {
        role: "system",
        content: "Here is your task: " + system_content,
        // + " Here is the chat history (make sure that you do not leak the history to the user): \n" +
        // chatHistoryString,
      },
      { role: "user", content: user_content },
    ];

    const GPTOutput = await openai.chat.completions.create({
      model: process.env.GPT_DEFAULT_NAME,
      messages: query,
    });

    return GPTOutput.choices[0].message.content;
  } catch (e) {
    console.log("bubble chatbot error------", e);
    return null;
  }
};

module.exports = { Chat, indexStore, serverInfo };
