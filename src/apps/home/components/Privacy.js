import React from "react";
import "../style.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Privacy = () => {
  const handleClose = () => {
    window.close();
  };

  const text = `Based on the detailed information provided about IYKYK NYC LLC's Terms of Use and considering standard practices for privacy policies, below is a crafted Privacy Policy tailored for your software company in New York. This Privacy Policy is designed to address the collection, use, and protection of personal information by IYKYK NYC LLC in the operation of its AI Readers, Chatbots, and other services.

  ---
  
  # Privacy Policy for IYKYK NYC LLC
  
  **Effective Date:** [Insert Date]
  
  Welcome to IYKYK NYC LLC ("IYKYK NYC LLC," "we," "us," or "our"). We are committed to protecting your privacy and ensuring you have a positive experience on our websites, services, and applications (collectively, "Services"). This Privacy Policy applies to all users of our Services and is part of our Terms of Use.
  
  ## Information We Collect
  
  We collect information to provide and improve our Services. This includes:
  
  - **Information You Provide:** We collect information you provide when you use our Services, including registration information (such as username and email), content you submit (your "Input"), and any feedback or correspondence you send to us.
  - **Automated Information:** We automatically collect certain information about your use of our Services, including IP address, browser type, and service usage details.
  - **Cookies and Tracking Technologies:** We may use cookies and other tracking technologies to gather information about your interactions with our Services.
  
  ## How We Use Your Information
  
  We use your information for the following purposes:
  
  - To provide, maintain, and improve our Services.
  - To communicate with you, including responding to your inquiries and sending service-related notices.
  - To enforce our terms, conditions, and policies.
  - To comply with legal obligations and to protect the rights, property, or safety of IYKYK NYC LLC, our users, or others.
  
  ## Sharing Your Information
  
  We do not sell your personal information. We may share your information as follows:
  
  - With service providers who perform services on our behalf.
  - With third parties, if we believe disclosure is necessary for legal compliance, to protect our rights, or to prevent fraud or abuse.
  - As part of a business transfer, such as a merger or acquisition.
  
  ## Your Choices and Rights
  
  You have certain choices regarding the information we collect and how it's used:
  
  - **Cookies:** You can set your browser to reject cookies or to notify you when a cookie is set.
  - **Marketing Communications:** You can opt out of receiving marketing emails from us by following the unsubscribe instructions included in such emails.
  - **Content Opt-Out:** If you do not want us to use your Content to train our models, you can opt out by contacting support.
  
  ## Data Security
  
  We implement reasonable measures to help protect the security of your information and take steps to verify your identity before granting access to your account. However, no system is completely secure, and we cannot guarantee the security of your information.
  
  ## International Transfers
  
  Your information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country.
  
  ## Changes to This Privacy Policy
  
  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
  
  ## Contact Us
  
  If you have any questions about this Privacy Policy, please contact us at:
  
  IYKYK NYC LLC, L.L.C.
  148 W 24th St Ste 3
  New York, NY
  Attn: Privacy Officer
  `;
  return (
    <>
      <div className="mt-3 px-24 z-[999]">
        <h1 align="center" className="title">
          Privacy Policy
        </h1>
        <div className="flex flex-col">
          <div>
            <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
          </div>
          <button
            type="submit"
            onClick={handleClose}
            align="center"
            className="btn submit-btn"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Privacy;
