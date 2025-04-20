import React, { useState, useRef, useEffect } from "react";
import { getStyles } from "../../menu/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleStop,
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faVolumeHigh,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { generateChat } from "../apis";
import "../style.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTokenOrRefresh } from "./speech";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";

// const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const SPEECH_KEY = "f13aae8580694ea9a1062b7fe8e08f7b";
const SPEECH_REGION = "eastus";

function Chat({
  activeChat,
  setActiveChat,
  setQueries,
  questionList,
  setQuestionList,
}) {
  const theme = useSelector((store) => store.setting.isDark);

  const activeModel = useSelector((store) => store.auth.activeModel);
  const [question, setQuestion] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [setStyle, setStyleData] = useState(false);
  const [player, updatePlayer] = useState({ p: undefined, muted: false });
  const [isPlay, setPlayStatus] = useState(false);
  // const [recognizer, setRecognizer] = useState(null);

  const bottomRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const speechConfig = useRef(null);
  const audioConfig = useRef(null);
  const recognizer = useRef(null);
  const myPlayer = useRef(null);

  const { first_question, font_size, font_color, chat_back } =
    setStyle.length > 0 ? setStyle[0] : {};
  const handleSendMessage = async () => {
    // e.preventDefault();
    setQuestionList([...questionList, question]);

    if (!question) {
      return;
    }
    let payload = {
      question: question,
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
    payload.isBubble = false;
    setIsLoading(true);
    setQuestion("");
    await generateChat(payload)
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
        toast(err.response?.data?.error || err.message, {
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

  const getStyle = async () => {
    setIsLoading(true);
    await getStyles()
      .then((res) => {
        setStyleData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.queries.length]);

  useEffect(() => {
    getStyle();

    speechConfig.current = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );
    speechConfig.current.speechRecognitionLanguage = "en-US";

    audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer.current = new sdk.SpeechRecognizer(
      speechConfig.current,
      audioConfig.current
    );

    const processRecognizedTranscript = (event) => {
      const result = event.result;
      console.log("Speech to text-past: ", result);

      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        const transcript = result.text;
        console.log("Transcript: -->", transcript);
        // Call a function to process the transcript as needed
        setQuestion(transcript);
      }
    };

    const processRecognizingTranscript = (event) => {
      const result = event.result;
      console.log("Speech to text-is doing:", result);
      if (result.reason === sdk.ResultReason.RecognizingSpeech) {
        const transcript = result.text;
        console.log("Transcript: -->", transcript);
        setQuestion(transcript);
        // Call a function to process the transcript as needed
      }
    };

    recognizer.current.recognized = (s, e) => processRecognizedTranscript(e);
    recognizer.current.recognizing = (s, e) => processRecognizingTranscript(e);

    // recognizer.current.startContinuousRecognitionAsync(() => {
    //   console.log("Speech recognition started.");
    //   setIsListening(true);
    // });

    return () => {
      recognizer.current.stopContinuousRecognitionAsync(() => {
        setIsListening(false);
      });
    };
  }, []);

  const pauseListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync();
    console.log("Paused listening.");
  };

  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      recognizer.current.startContinuousRecognitionAsync(() => {
        console.log("Start microphone listening...");
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync(() => {
      console.log("Speech recognition stopped.");
    });
  };

  const handleRecording = () => {
    console.log(isListening, "----isListening");
    isListening ? pauseListening() : resumeListening();
    setIsListening(!isListening);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // console.log("Enter key pressed ✅");
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  async function textToSpeech(texts) {
    const filtered_text = texts.replace(/#/g, "");
    myPlayer.current = new sdk.SpeakerAudioDestination();
    myPlayer.current.onAudioEnd = () => {
      setPlayStatus(false);
    };
    updatePlayer((p) => {
      p.p = myPlayer.current;
      return p;
    });

    const audioConfig = sdk.AudioConfig.fromSpeakerOutput(myPlayer.current);
    let synthesizer = new sdk.SpeechSynthesizer(
      speechConfig.current,
      audioConfig
    );
    synthesizer.speakTextAsync(
      filtered_text,
      (result) => {
        console.log("----resutl----------", result);
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesizer is finished");
        } else if (result.reason === sdk.ResultReason.Canceled) {
          console.error(
            `synthesis failed. Error detail: ${result.errorDetails}.\n`
          );
        }
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        console.log(`Error: ${err}.\n`);
        synthesizer.close();
        synthesizer = undefined;
      }
    );
  }
  async function handleMute() {
    updatePlayer((p) => {
      if (p.muted === false) {
        p.p.privIsPaused = false;
        p.p.pause();
        return { p: p.p, muted: true };
      } else {
        p.p.resume();
        return { p: p.p, muted: false };
      }
    });
  }
  return (
    <>
      <div className="flex flex-col justify-between mb-2">
        <div>
          {/* <h1 className="font-bold text-xl text-black p-4">Agent Query</h1> */}
          <div
            // style={{ backgroundColor: chat_back }}
            className={`${
              (questionList.length > 0 || activeChat.queries.length > 0) &&
              (theme === true
                ? `bg-[${chat_back}]  text-white`
                : "white border-slate-300")
            } rounded overflow-y-scroll h-[70vh] md:h-[75vh] w-full md:w-[70%] mx-auto md:p-0 p-4 flex flex-col`}
          >
            {questionList.length === 0 ? (
              <div
                className={`text-xl font-bold flex justify-center ${
                  theme === true ? "text-[#ececf1]" : "text-black"
                }`}
              >
                <span
                  // style={{ fontSize: font_size, color: font_color }}
                  className="font-bold"
                >
                  {!first_question ? "How can I help you?" : first_question}
                </span>
              </div>
            ) : (
              <></>
            )}
            {questionList.length > 0 &&
              questionList.map((m, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 my-6 p-2"
                >
                  <div className="flex flex-col items-start">
                    <p
                      style={
                        theme === true
                          ? { fontSize: font_size, color: font_color }
                          : { fontSize: font_size, color: "black" }
                      }
                      className={`font-bold`}
                    >
                      {m && "You"}
                    </p>
                    <p
                      style={
                        theme === true
                          ? { fontSize: font_size, color: font_color }
                          : { fontSize: font_size, color: "black" }
                      }
                      className={`${
                        theme === true ? "text-gray-300" : "text-black"
                      }`}
                    >
                      {m}
                    </p>

                    <p
                      style={
                        theme === true
                          ? { fontSize: font_size, color: font_color }
                          : { fontSize: font_size, color: "black" }
                      }
                      className={`${
                        theme === true ? "text-gray-300" : "text-black"
                      } font-bold`}
                    >
                      {m && "Answer"}
                    </p>
                    {isLoading && questionList.length - 1 === index && (
                      <p
                        style={
                          theme === true
                            ? { fontSize: font_size, color: font_color }
                            : { fontSize: font_size, color: "black" }
                        }
                        className={`${
                          theme === true ? "text-gray-300" : "text-black"
                        } text-sm animate-pulse text-center`}
                      >
                        Loading...
                      </p>
                    )}
                    {activeChat.queries.map((ans, index) => (
                      <div
                        style={
                          theme === true
                            ? { fontSize: font_size, color: font_color }
                            : { fontSize: font_size, color: "black" }
                        }
                        key={index}
                        className={`${
                          theme === true ? "text-gray-300" : "text-black"
                        }`}
                      >
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {m === ans.question && ans.solution}
                        </Markdown>
                      </div>
                    ))}
                    {activeChat.queries.map(
                      (ans, index) =>
                        m === ans.question &&
                        !isPlay && (
                          <button
                            onClick={() => {
                              setPlayStatus(true);
                              textToSpeech(ans.solution);
                            }}
                            key={index}
                          >
                            <FontAwesomeIcon icon={faVolumeHigh} />
                          </button>
                        )
                    )}
                  </div>
                </div>
              ))}
            <div ref={bottomRef} />
          </div>
        </div>
        {/* {isLoading && (
          <p className="text-black text-sm animate-pulse text-center">
            Loading...
          </p>
        )} */}
        <div className="w-full flex  justify-center items-center flex-row p-4 md:p-0">
          {isPlay && (
            <button
              onClick={() => {
                handleMute();
                setPlayStatus(false);
              }}
              className="mr-2 p-3"
            >
              <FontAwesomeIcon
                icon={faCircleStop}
                className={`${
                  theme === true ? "text-white" : "text-black"
                } text-2xl`}
              />
            </button>
          )}
          <button className="mr-2 p-3" onClick={() => handleRecording()}>
            <FontAwesomeIcon
              icon={isListening ? faMicrophone : faMicrophoneSlash}
              className={`${
                theme === true ? "text-white" : "text-black"
              } text-2xl`}
            />
          </button>
          <div className="w-full md:w-[65%] h-[55px] border border-gray-600 flex items-center rounded-lg p-2">
            <button
              onClick={() => setQuestion("")}
              className="h-full p-2 rounded-lg icon-style text-[#ececf1]"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
            <input
              value={question}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`${
                theme === true ? "text-gray-300" : "text-black"
              } h-full w-full p-2 outline-none bg-inherit`}
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
        <div className="flex justify-between px-6 pt-6">
          <Link
            to={"/policy"}
            target="_blank"
            className={`${
              theme === true ? `text-white ` : `text-black`
            } underline`}
          >
            Our Policy
          </Link>
          <Link
            to={"/terms"}
            target="_blank"
            className={`${
              theme === true ? `text-white ` : `text-black`
            } underline `}
          >
            Term and Condition
          </Link>
          <Link
            to={"/privacy"}
            target="_blank"
            className={`${
              theme === true ? `text-white ` : `text-black`
            } underline `}
          >
            Privacy Policy
          </Link>
          <Link
            to="mailto:support-team@iykyknow.ai"
            className={`${
              theme === true ? `text-white ` : `text-black`
            } underline `}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}

export default Chat;
