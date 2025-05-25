
import axios from "axios";

const natcur = window.localStorage.getItem("natcur")


export const prices:any = [
    // {
    //   name: "Starter",
    //   features: new Array(3).fill(null).map((e) => "Lorem iptsum dolor"),
    //   info: "Fusce purus tellus, tristique quis libero sit amet..."
    // },
    {
      name: "pro",
      price: natcur=="IN"?"₹2999":"$40",
      amount:natcur=="IN"?"2999":"40",
      //popular: true,
      features: ["40 Professional Headshots","Ready in 90 minutes"],
      info: "Fusce purus tellus, tristique quis libero sit amet..."
    },
    {
      name: "business",
      price: natcur=="IN"?"₹5999":"$70",
      amount:natcur=="IN"?"5999":"70",
      features:["100 Professional Headshots","Ready in 60 minutes"],
      info: "Fusce purus tellus, tristique quis libero sit amet..."
    },
    {
      name: "special",
      price: natcur=="IN"?"₹9999":"$100",
      amount:natcur=="IN"?"9999":"100",
      features: ["200 Professional Headshots","Ready in 15 minutes"],
      info: "Fusce purus tellus, tristique quis libero sit amet..."
    }
  ];


  