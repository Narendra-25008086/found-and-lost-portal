const WEB_APP_URL="https://script.google.com/macros/s/AKfycbwdAZD02o5KUVDhUX7dyGSSgRlN9MlEc0L7Cd5JpqK8JKT9mNsjfV4jgm13RRbqtxF1/exec";

const IMGBB_API_KEY="11e0467cc3073fc5382dd6ca0aac3ef5";


function toggleQuestion(){

const type=document.getElementById("type").value;
const section=document.getElementById("verifySection");

section.style.display=(type==="Found")?"block":"none";

}


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

alert("Please fill all fields");

loader.style.display="none";
btn.disabled=false;
return;

}


// Upload Image

const formData=new FormData();
formData.append("image",imageFile);

const upload=await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,{
method:"POST",
body:formData
});

const uploadData=await upload.json();

const imageURL=uploadData.data.url;


// Send Data

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

const fragment=document.createDocumentFragment();

for(let i=data.length-1;i>=1;i--){

const row=data[i];

const card=createCard(
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

fragment.appendChild(card);

}

container.appendChild(fragment);

}



function createCard(rowIndex,name,year,dept,item,type,description,question,secret,contact,imageURL,status){

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

<img src="${imageURL}" loading="lazy">

<p class="name"><b>Name:</b> ${name}</p>

<p class="year"><b>Year:</b> ${year}</p>

<p class="dept"><b>Department:</b> ${dept}</p>

<p class="item"><b>Item:</b> ${item}</p>

<p class="desc"><b>Description:</b> ${description}</p>

<p class="contact"><b>Phone:</b> ${contact}</p>

${verifyBtn}

`;

return card;

}



async function verifyOwner(question,secret,rowIndex,btn){

const answer=prompt(question);

if(answer===null)return;

if(answer.toLowerCase()===secret.toLowerCase()){

const card=btn.closest(".card");

const name=card.querySelector(".name").innerText;
const year=card.querySelector(".year").innerText;
const dept=card.querySelector(".dept").innerText;
const contact=card.querySelector(".contact").innerText;

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


alert(

"✅ Owner Verified!\n\n"+
"Kindly contact the founder to claim the item.\n\n"+
name+"\n"+
year+"\n"+
dept+"\n"+
contact

);

}else{

alert("Wrong Answer");

}

}



function filterItems(){

const input=document.getElementById("searchInput").value.toLowerCase();

const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=text.includes(input)?"":"none";

});

}



window.onload=loadItems;