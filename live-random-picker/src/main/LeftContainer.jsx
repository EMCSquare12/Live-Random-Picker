import ResultDisplay from "../components/ResultDisplay"
const LeftContainer = () => {
    const [winner, setWinner] = useState(null);
    const [isPicking, setIsPicking] = useState(false);
  
  return <div className="bg-white  p-6 sm:p-8  w-full max-w-lg relative ">
    {winner && (
        <ResultDisplay 
          winner={winner} 
          isPicking={isPicking} 
        />
      )}
  </div>; 
    
   

}
export default LeftContainer;