import { useContext } from "react";
import { ProjectContext } from "../contexts/ProjectContext";

export default function useProject() {
  const context = useContext(ProjectContext);
  return context;
}
