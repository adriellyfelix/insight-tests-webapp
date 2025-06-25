import { useContext } from "react";
import { TestCaseContext } from "../contexts/TestCaseContext";

export default function useCaseTest() {
  const context = useContext(TestCaseContext);
  return context;
}
