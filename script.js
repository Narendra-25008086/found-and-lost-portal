const WEB_APP_URL="https://script.google.com/macros/s/AKfycbwdAZD02o5KUVDhUX7dyGSSgRlN9MlEc0L7Cd5JpqK8JKT9mNsjfV4jgm13RRbqtxF1/exec";

const IMGBB_API_KEY="11e0467cc3073fc5382dd6ca0aac3ef5";


function toggleQuestion(){

const type=document.getElementById("type").value;
const section=document.getElementById("verifySection");

section.style.display=(type==="Found")?"block":"none";

}


// helper function
function nameInput(id){
return document.getElementById(id).value.trim();
}


async function submitForm(){

const loader=document.getElementById("loader");
const btn=document.getElementById("submitBtn");

loader.style.display="block";
btn.disabled=true;

try{

const name=nameInput("name");
const year=nameInput("year");
const dept=nameInput("dept");
const item=nameInput("item");
const type=nameInput("type");
const description=nameInput("description");
const question=nameInput("question");
const secret=nameInput("secret");
const contact=nameInput("contact");

const imageFile=document.getElementById("imageFile").files[0];

if(!name||!year||!dept||!item||!type||!description||!contact||!imageFile){

alert("Fill all fields");

loader.style.display="none";
btn.disabled=false;

return;

}

// upload image

const formData=new FormData();
formData.append("image",imageFile);

const upload=await fetch(
`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
{
method:"POST",
body:formData
});

const uploadData=await upload.json();
const imageURL=uploadData.data.url;


// send data to sheet

const data={
name,
year,
dept,
item,
type,
description,
question,
secret,
contact,
imageURL
};

const response=await fetch(WEB_APP_URL,{
method:"POST",
body:JSON.stringify(data)
});

const result=await response.json();

if(result.status==="success"){

alert("Item Submitted Successfully");

document.getElementById("lostForm").reset();

loadItems();

}

}catch(error){

alert("Error: "+error.message);

}

loader.style.display="none";
btn.disabled=false;

}



async function loadItems(){

const response=await fetch(WEB_APP_URL);
const data=await response.json();

const container=document.getElementById("itemsContainer");

container.innerHTML="";

for(let i=data.length-1;i>=1;i--){

const row=data[i];

addCard(
i,
row[0],
row[1],
row[2],
row[3],
row[4],
row[5],
row[6],
row[7],
row[8],
row[9],
row[10]
);

}

}


function addCard(rowIndex,name,year,dept,item,type,description,question,secret,contact,imageURL,status){

const container=document.getElementById("itemsContainer");

const card=document.createElement("div");
card.className="card";

let verifyBtn="";

if(type==="Found"){

if(status==="Claimed"){

verifyBtn=`<button class="claimed" disabled>Claimed ✅</button>`;

}else{

verifyBtn=`<button onclick="verifyOwner('${question}','${secret}',${rowIndex},this)">Verify Owner</button>`;

}

}

card.innerHTML=`

<img src="${imageURL}">

<p><b>Name:</b> ${name}</p>


<p><b>Item:</b> ${item}</p>

<p><b>Type:</b> ${type}</p>

<p><b>Description:</b> ${description}</p>

<p><b>Contact:</b> ${contact}</p>

${verifyBtn}

`;

container.appendChild(card);

}



async function verifyOwner(question,secret,rowIndex,btn){

const answer = prompt(question);

if(answer === null) return;

if(answer.toLowerCase() === secret.toLowerCase()){

btn.innerText="Claimed ✅";
btn.classList.add("claimed");
btn.disabled=true;

await fetch(WEB_APP_URL,{
method:"POST",
body:JSON.stringify({
action:"claim",
row:rowIndex
})
});

// get card info
const card = btn.closest(".card");

const item = card.querySelector("p:nth-child(2)").innerText;
const contact = card.querySelector("p:nth-child(5)").innerText;

alert(
"✅ Owner Verified!\n\n"+
"Kindly contact the founder to claim the item.\n\n"+
item+"\n"+
contact
);

}else{

alert("❌ Wrong Answer");

}

}


function filterItems(){

const input=document.getElementById("searchInput").value.toLowerCase();

const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=text.includes(input)?"block":"none";

});

}


window.onload=loadItems;