export type Listing = {
 id:string; title:string; category:string; price:number; condition:string;
 description:string; seller:string; emoji:string; accent:string; location:string
};
export const listings: Listing[] = [
 {id:"1",title:"Engineering Mathematics — Vol. 1",category:"Books",price:280,condition:"Good",description:"Clean pages with a few pencil marks. All chapters included.",seller:"Arun K.",emoji:"📘",accent:"#E7EEFF",location:"Main campus"},
 {id:"2",title:"Casio Scientific Calculator",category:"Electronics",price:650,condition:"Like new",description:"Fully working calculator with protective cover. Inspect before purchase.",seller:"Meera S.",emoji:"🧮",accent:"#E2F4E8",location:"Library block"},
 {id:"3",title:"White Lab Coat — Size M",category:"Lab & Drawing",price:180,condition:"Good",description:"Washed and ready to use. Medium size.",seller:"Karthik R.",emoji:"🥼",accent:"#FFF0D6",location:"Science block"},
 {id:"4",title:"Data Structures in Java",category:"Books",price:350,condition:"Fair",description:"Reference book with some highlighting. Binding intact.",seller:"Nila P.",emoji:"📗",accent:"#F0E8FF",location:"Main campus"},
 {id:"5",title:"Desk Lamp",category:"Hostel",price:220,condition:"Good",description:"Working desk lamp, can be tested at pickup.",seller:"Vishal M.",emoji:"💡",accent:"#FFF0D6",location:"Hostel entrance"},
 {id:"6",title:"Engineering Drawing Kit",category:"Lab & Drawing",price:300,condition:"Good",description:"Compass, divider, set squares and ruler in a case.",seller:"Priya D.",emoji:"📐",accent:"#E7EEFF",location:"Main campus"}
];