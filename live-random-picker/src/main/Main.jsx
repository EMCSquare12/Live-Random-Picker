import LeftContainer from "./LeftContainer";
import RightConatiner from "./RightContainer";

const Main = () => {
    return <div className="flex flex-row  h-fit w-full justify-evenly mt-6 mb-6 items-stretch">
        <LeftContainer/>
        <RightConatiner/>
    </div>
}
export default Main;