import { useSelector } from "react-redux";
import { getLoader } from "../../slice/loaderSlice";

export default function Loader({ fallback = false }) {
  const loader = useSelector(getLoader);
  if (!(fallback || loader)) return null;
  return <div className="loader-spinner"></div>;
}
