import React from "react";
import "../style.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Policy = () => {
  const handleClose = () => {
    window.close();
  };

  const text = `### Acceptable Use Policy

  **Introduction**
  This Acceptable Use Policy outlines the standards and rules that users must follow when interacting with [Your Company Name]'s AI chatbot services. Our goal is to ensure a safe, reliable, and respectful environment for all users.
  
  **Acceptable Use**
  Users are expected to use our AI chatbot services responsibly and with respect for others. Specifically, users must not:
  - Engage in illegal activities or use the services for any unlawful purposes.
  - Transmit content that is threatening, abusive, harassing, defamatory, or discriminatory.
  - Post or transmit content that infringes on the intellectual property rights of others.
  - Attempt to gain unauthorized access to the AI chatbot services, other users' accounts, or networks connected to the services.
  - Distribute viruses, malware, or any other harmful software or data.
  - Use the services to send spam or otherwise duplicative or unsolicited messages.
  
  **Enforcement**
  Violations of this Acceptable Use Policy may result in temporary or permanent suspension of access to our AI chatbot services. We reserve the right to remove content that violates this policy and to cooperate with law enforcement authorities in investigating suspected unlawful behavior.
  
  ### Data Retention Policy
  
  **Purpose**
  IYKYK NYC LLC is committed to responsible data management and compliance with applicable data protection laws. This Data Retention Policy outlines how we handle the data collected through our AI chatbot services, including how long we retain data and our procedures for data deletion.
  
  **Data Retention**
  - Personal data collected through our AI chatbot services will be retained only as long as necessary to fulfill the purposes for which it was collected, including for the provision of our services, compliance with legal obligations, and resolution of disputes.
  - Unless required by law to retain data for a longer period, we will delete or anonymize personal data when it is no longer necessary for the purposes for which it was collected.
  
  **Data Deletion**
  - Users can request the deletion of their personal data by contacting our support team. We will process such requests in accordance with applicable laws and regulations.
  - We regularly review and update our data retention practices to ensure compliance with legal obligations and industry best practices.
  
  ### Security Policy
  
  **Commitment to Security**
  IYKYK NYC LLC is committed to protecting the security of the data collected through our AI chatbot services. We implement a range of security measures designed to protect against unauthorized access, alteration, disclosure, or destruction of personal data.
  
  **Security Measures**
  - We use encryption, firewalls, and access controls to safeguard personal data.
  - Our employees receive training on data security and privacy practices.
  - We conduct regular security assessments and audits to identify and address potential vulnerabilities.
  
  **Data Breach Response**
  - In the event of a data breach, we will promptly investigate the incident, take steps to mitigate any harm, and notify affected users and relevant authorities as required by law.
  
  **User Responsibilities**
  - Users are responsible for maintaining the confidentiality of their account credentials and for any activities conducted through their accounts.
  - Users should notify us immediately if they suspect any unauthorized use of their account or any other breach of security.`;
  return (
    <>
      <div className="mt-3 px-24 z-[999]">
        <h1 align="center" className="title">
          Welcome to Policy
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

export default Policy;
