import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const boardClientSocket = io('http://localhost:8000');

const CanvasBoard = () => {
  let canvasRef = useRef<any>(null);
  let ctxRef = useRef<any>(null);

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    
    ctxRef.current.lineWidth = 2;
    ctxRef.current.lineCap = 'square';
    ctxRef.current.strokeStyle = 'red';

    const handleSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    handleSize();

    boardClientSocket.on('drawing', (data: any) => {
        const {offsetX, offsetY} = data;
        ctxRef.current.lineTo(offsetX+5, offsetY+5);
        ctxRef.current.stroke();
    });
    window.addEventListener('resize', handleSize);
    return () => {
        window.removeEventListener('resize', handleSize);
        // boardClientSocket.off('drawing');
        // boardClientSocket.emit('disconnecttt');
      };
  }, []);

  const startDrawing = ({nativeEvent}: any) => {
    const {offsetX, offsetY} = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
    
  }

  const draw = ({ nativeEvent }: any) => {

    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
     ctxRef.current.lineTo(offsetX, offsetY);
     ctxRef.current.stroke();


     boardClientSocket.emit('drawing', { offsetX, offsetY });
  };

  const endDrawing = () => {
    ctxRef.current.closePath();
    setDrawing(false);
  }


  return (
    <div className="canvas-board">
        <h1>Socket: {boardClientSocket.id}</h1>
      <canvas 
        className='canvas-board__canvas' 
        ref={canvasRef} 
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        // onMouseLeave={endDrawing}
       

        />
       
      
    </div>
  )
}

export default CanvasBoard
