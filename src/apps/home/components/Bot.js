import React, { useState, useEffect } from "react";
import BubbleChat from "../../chat/components/BubbleChat";
import "../style.css";
import { getAllQueries, verifyURL } from "../apis";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../auth/actions";
import setAuthHeader from "../../../_helpers/setAuthHeader";

const Bot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatbotExist, setIsChatbotExist] = useState(false);
  const [queries, setQueries] = useState([]);
  const [activeChat, setActiveChat] = useState({ queries: [] });
  const dispatch = useDispatch();
  const theme = useSelector((store) => store.setting.isDark);
  const [questionList, setQuestionList] = useState([]);
  const [avatar, setAvatar] = useState("");
  const { tokens } = useParams();

  // const getQueries = async () => {
  //   setIsLoading(true);
  //   await getAllQueries()
  //     .then((res) => {
  //       setQueries(res.data?.chats || []);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log("error ", err);
  //       setIsLoading(false);
  //     });
  // };

  const verifyChatbot = async () => {
    setIsLoading(true);
    const [org, app, email] = tokens?.split("&");
    const chatbotInfo = await verifyURL({ org, app, email });
    if (chatbotInfo) {
      setIsChatbotExist(true);
      setAvatar(chatbotInfo.avatar);
      dispatch(setUser(chatbotInfo));
      setAuthHeader(chatbotInfo.token);
    } else {
      setIsChatbotExist(false);
    }
    setIsLoading(false);
    // getQueries();
  };
  useEffect(() => {
    verifyChatbot();
  }, [tokens]);

  if (isLoading) {
    return <div className="coverSpinner"></div>;
  }
  const originColor = theme === true ? "block" : "#171717";

  return isChatbotExist ? (
    <div
      style={{
        backgroundColor: !originColor,
      }}
    >
      <BubbleChat
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        setQueries={setQueries}
        questionList={questionList}
        setQuestionList={setQuestionList}
        avatar={avatar}
      />
    </div>
  ) : (
    <>Your chatbot URL is failed</>
  );
};

export default Bot;
