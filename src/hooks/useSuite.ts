import { useContext } from "react";
import { SuiteContext } from "../contexts/SuiteContext";

export default function useSuite() {
  const context = useContext(SuiteContext);
  return context;
}
