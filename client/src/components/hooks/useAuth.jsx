import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export function useAuth(){
    const context = useContext(AuthContext)

    if(!context) throw Error("useAuth must be used inside provider");

    return context
}