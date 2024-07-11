import { useEffect } from "react";
import { register } from "@teamhanko/hanko-elements";

const hankoApi:string = process.env.REACT_APP_HANKO_API_URL || "";

export default function HankoProfile() {
  useEffect(() => {
    register(hankoApi).catch((error) => {
      // handle error
    });
  }, []);

  return <hanko-profile />;
}
