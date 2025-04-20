import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faMessage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { generateBubbleChat } from "../apis";
import "../style.css";
import { useSelector } from "react-redux";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function BubbleChat({
  activeChat,
  setActiveChat,
  setQueries,
  questionList,
  setQuestionList,
  avatar,
}) {
  const serverAddress = process.env.REACT_APP_URL;
  const activeModel = useSelector((store) => store.auth.activeModel);
  const [question, setQuestion] = useState("");
  const [isOpen, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef(null);

  const timestampedQuestions = useRef([]);

  const handleSendMessage = async () => {
    if (!question) {
      return;
    }

    const timestamp = new Date().toLocaleString();
    const messageWithTimestamp = `${question} (Sent at: ${timestamp})`;

    // Add the user-visible message without the timestamp to the question list
    setQuestionList([...questionList, question]);
    // Add the timestamped question to the list
    timestampedQuestions.current.push(messageWithTimestamp);

    let payload = {
      question: messageWithTimestamp,
      modelId: activeModel,
    };

    if (!activeChat.id) {
      const splitQues = question.split(" ");
      payload.isNew = true;
      payload.title = 
        splitQues[0] + " " + (splitQues[1] || "") + " " + (splitQues[2] || "");
    } else {
      payload.id = activeChat.id;
    }

    payload.isBubble = true;
    payload.status = true;
    setIsLoading(true);
    setQuestion("");

    await generateBubbleChat(payload)
      .then((res) => {
        setQueries(res.data.chats);

        const oldActiveChat = res.data.chats.find(
          (chat) => chat.id === activeChat.id
        );
        const chat = oldActiveChat
          ? oldActiveChat
          : res.data.chats[res.data.chats.length - 1];
        setActiveChat(chat);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        toast("Something went wrong. Please check retrain model status", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questionList, activeChat.queries.length]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleBubbleClick = () => {
    setOpen(!isOpen);
    window.parent.postMessage(
      {
        type: "toggleChat",
        isOpen: !isOpen,
      },
      "*"
    );
  };

  return (
    <div>
      <div
        className={`flex flex-col justify-between bg-transparent rounded-t-lg mb-4 h-full w-full pt-16 pl-4 fixed right-4 bottom-12 shadow-lg border-1 rounded-lg overflow-hidden transition-transform duration-300  ${
          isOpen ? "" : "transform translate-y-full opacity-0"
        } `}
      >
        <div className="bg-sky-900 w-full h-12 flex justify-start items-center rounded-t-lg">
          <img
            src={
              avatar
                ? `${serverAddress}/avatar/${avatar}`
                : "/images/default_bot.png"
            }
            className="w-10 ml-2 rounded-lg"
          />
        </div>
        <div className="h-full overflow-y-scroll bg-white">
          <div
            className={`${
              questionList.length > 0 || activeChat.queries.length > 0
            } rounded overflow-y-scroll  w-full  mx-auto md:p-0 p-4 flex flex-col`}
          >
            <div className={`text-sm font-bold flex justify-start my-1`}>
              <img
                src={
                  avatar
                    ? `${serverAddress}/avatar/${avatar}`
                    : "/images/default_bot.png"
                }
                className="w-10 h-10 rounded-lg ml-1"
              />
              <span className="font-bold ml-1 bg-gray-300 p-2 rounded-lg">
                {"How can I help you?"}
              </span>
            </div>
            {questionList.length > 0 &&
              questionList.map((message, index) => (
                <div key={index}>
                  <div className="flex flex-col items-end w-full my-1 ">
                    <p className="p-2 rounded-lg bg-indigo-700 text-white">
                      {message}
                    </p>
                  </div>

                  <div className={`text-sm font-bold flex justify-start my-1`}>
                    <img
                      src={
                        avatar
                          ? `${serverAddress}/avatar/${avatar}`
                          : "/images/default_bot.png"
                      }
                      className="w-10 h-10 rounded-lg ml-1"
                    />
                    <span className="font-bold ml-1 bg-gray-300 p-2 rounded-lg">
                      {isLoading && questionList.length - 1 === index ? (
                        <span className="flex justify-center items-center h-full">
                          <img src="/images/dots.gif" className="w-12" />
                        </span>
                      ) : (
                        activeChat.queries
                          .filter(
                            (ans) =>
                              ans.question ===
                              timestampedQuestions.current[index]
                          )
                          .map((ans, ansIndex) => (
                            <p key={ansIndex}>
                              <Markdown remarkPlugins={[remarkGfm]}>
                                {ans.solution}
                              </Markdown>
                            </p>
                          ))
                      )}
                    </span>
                  </div>
                </div>
              ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="w-full h-[50px] border border-gray-600 flex items-center rounded-lg p-2">
            <input
              value={question}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`h-full w-full p-2 outline-none bg-inherit`}
              type="text"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="h-full p-2 rounded-lg icon-style text-[#ececf1]"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <p className="text-xs text-white p-2 text-center"></p>
          <ToastContainer />
        </div>
      </div>
      <button
        onClick={handleBubbleClick}
        className="bg-sky-900 rounded-full w-[50px] h-[50px] p-2 shadow-lg text-white fixed bottom-1 right-4"
      >
        <FontAwesomeIcon icon={isOpen ? faChevronDown : faMessage} />
      </button>
    </div>
  );
}

export default BubbleChat;
