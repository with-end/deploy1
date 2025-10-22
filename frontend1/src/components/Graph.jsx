// components/XYGraph.js

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';


export default function Graph() {
    const [data , setData ] = useState([]) ;
    const [expr , setExpr ] = useState("") ;
    const [maxX , setMaxX ] = useState(100) ;
    const [minX , setMinX ] = useState(0) ;
    const [gap , setGap ] = useState(1) ;

    useEffect(() =>{
        let expr1 = expr.replace(/sin/g , "Math.sin")
                   .replace(/tan/g , "Math.tan")
                   .replace(/log/g , "Math.log") 
                   .replace(/cos/g , "Math.cos") 
                   .replace(/\^/g , "**") ;
        const temp = [];
        for (let i =minX; i <= maxX ; i+=gap) {
          const  j = eval(expr1); 
        
          temp.push({ x: i, y: j });
        }
       setData(temp);

    },[expr , maxX , minX  , gap ])

  return (
    <div className="bg-white shadow-lg rounded-xl p-2 w-full h-[calc(100vh_-60px)] mx-auto mt-1">
      <div className="flex justify-between w-[100%] ">
         <div className="flex items-center">
          <p className="text-2xl"> FUNC:</p>
          <input   type="text"
                  className=" h-16  px-2 text-2xl font-bold ml-1 text-white bg-gray-500 rounded-md" 
                  placeholder="enter your function in var of i"
                  onKeyDown={(e)=>{ if( e.key == "Enter"){ setExpr(e.target.value) }}}
                
         />
         <p className="text-2xl"> MinX:</p>
          <input   type="number"
                  className=" h-16 w-36 px-2 text-2xl font-bold ml-1 text-white bg-gray-500 rounded-md" 
                  placeholder="MIN X"
                  onKeyDown={(e)=>{ if( e.key == "Enter"){ setMinX(Number(e.target.value)) }}}
                
         />
         <p className="text-2xl"> MaxX:</p>
          <input   type="number"
                  className=" h-16 w-36 px-2 text-2xl font-bold ml-1 text-white bg-gray-500 rounded-md" 
                  placeholder="MAX X"
                  onKeyDown={(e)=>{ if( e.key == "Enter"){ setMaxX(Number(e.target.value)) }}}
                
         />
         <p className="text-2xl"> GapX:</p>
          <input   type="number"
                  className=" h-16 w-36 px-2 text-2xl font-bold ml-1 text-white bg-gray-500 rounded-md" 
                  placeholder="GAP X"
                 onKeyDown={(e)=>{ if( e.key == "Enter"){ setGap(Number(e.target.value)) }}}
                
         />
        </div>
         <h2 className="text-xl font-bold text-center ">X-Y Graph</h2>
      </div>
      <ResponsiveContainer width="100%" height={600}>  
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: 'X-Axis', position: 'insideBottomRight', offset: -1 }} />
          <YAxis label={{ value: 'Y-Axis', angle: -90, position: 'insideLeft' }} /> 
          <Tooltip />             
          <Legend />   
          <Line type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={1} />
          <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={2} />
          
          <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={2} />
         
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
