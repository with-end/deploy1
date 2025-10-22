import React, { useState } from 'react';
import axios from 'axios';


function helperAi() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [ Darkness , setDarkness ] = useState(false) ;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChat([...chat, userMessage]);
    setInput('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatbot`, { message: input });
      const botMessage = { sender: 'bot', text: res.data.reply };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      alert('Error contacting ChatGPT API');
    }
  };

  return (
    <div className={` w-full  h-[calc(100vh_-_56px)] flex justify-center items-center  ${Darkness ? "bg-white" : "bg-gray-900 text-white"} `}>
     <div className="flex flex-col w-[50%] gap-5 p-4">
      <div className="flex justify-between">
         <h2 className="font-bold text-2xl">Smart Home Chat Assistant</h2>
         <button className="h-11 w-20 m-2 bg-blue-600 text-white " onClick={() => setDarkness((prev) => !prev)}> theme </button>
      </div>
      
      <div className={` h-[500px] p-3 scroll-mx w-full ${Darkness ? "bg-white" : "bg-gray-500"} text-white`}>
        {chat.map((msg, index) => (
          <div key={index} className={`${msg.sender == 'bot' ? "text-left text-yellow-300" : "text-right text-[#81ed73]"} text-lg  `}>
            <b className="text-red-500">{msg.sender === 'user' ? 'You' : 'Bot'}:</b><span className="italic">{msg.text}</span> 
            <br />
            <br />
          </div>
        ))}
      </div>
      <div className="input-group flex justify-between text-black">
        <input
          className={`w-[80%] h-10 p-2 ${!Darkness ? "bg-white" : "bg-green"}  `}
          type="text"
          placeholder="Ask ChatGPT something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className={`${!Darkness ? " text-white bg-[#8e30d6]" : "bg-green-500"} w-[15%]`}>Send</button>
      </div>
     </div>
    </div>
  );
}

export default helperAi;
