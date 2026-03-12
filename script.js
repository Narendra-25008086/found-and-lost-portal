const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwdAZD02o5KUVDhUX7dyGSSgRlN9MlEc0L7Cd5JpqK8JKT9mNsjfV4jgm13RRbqtxF1/exec";

const IMGBB_API_KEY = "11e0467cc3073fc5382dd6ca0aac3ef5";


// ===============================
// SHOW QUESTION FOR FOUND ITEM
// ===============================

function toggleQuestion(){

const type = document.getElementById("type").value;
const section = document.getElementById("verifySection");

if(type === "Found"){
section.style.display = "block";
}else{
section.style.display = "none";
}

}



// ===============================
// SUBMIT FORM
// ===============================

async function submitForm(){

const loader = document.getElementById("loader");
loader.style.display = "block";

const name = document.getElementById("name").value.trim();
const year = document.getElementById("year").value.trim();
const dept = document.getElementById("dept").value.trim();
const item = document.getElementById("item").value.trim();
const type = document.getElementById("type").value;
const description = document.getElementById("description").value.trim();
const question = document.getElementById("question").value.trim();
const secret = document.getElementById("secret").value.trim();
const contact = document.getElementById("contact").value.trim();
const imageFile = document.getElementById("imageFile").files[0];


if(!name || !year || !dept || !item || !type || !description || !contact || !imageFile){

loader.style.display="none";
alert("Fill all fields");
return;

}

if(type==="Found" && (!question || !secret)){

loader.style.display="none";
alert("Founder must add verification question");
return;

}



try{

// ===============================
// IMAGE UPLOAD
// ===============================

const formData = new FormData();
formData.append("image", imageFile);

const upload = await fetch(

`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,

{
method:"POST",
body:formData
}

);

const uploadData = await upload.json();
const imageURL = uploadData.data.url;



// ===============================
// SEND DATA TO GOOGLE SHEET
// ===============================

const data = {

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

const response = await fetch(WEB_APP_URL,{

method:"POST",
body:JSON.stringify(data)

});

const result = await response.json();


if(result.status === "success"){

alert("Item Submitted Successfully");

document.getElementById("lostForm").reset();

loadItems();

}

}catch(error){

alert("Error: "+error.message);

}


// Hide loader

loader.style.display="none";

}



// ===============================
// LOAD ITEMS
// ===============================

async function loadItems(){

const response = await fetch(WEB_APP_URL);
const data = await response.json();

const container = document.getElementById("itemsContainer");

container.innerHTML="";

for(let i=data.length-1;i>=1;i--){

const row = data[i];

addCard(

row[0],
row[1],
row[2],
row[3],
row[4],
row[5],
row[6],
row[7],
row[8],
row[9]

);

}

}



// ===============================
// CREATE ITEM CARD
// ===============================

function addCard(name,year,dept,item,type,description,question,secret,contact,imageURL){

const container = document.getElementById("itemsContainer");

const card = document.createElement("div");

card.className = "card";

let verifyBtn = "";

if(type === "Found"){

verifyBtn = `
<button onclick="verifyOwner('${question}','${secret}','${name}','${year}','${dept}','${contact}', this)">
Verify Owner
</button>
`;

}

card.innerHTML = `

<img src="${imageURL}">

<p><b>Item:</b> ${item}</p>

<p><b>Type:</b> ${type}</p>

<p><b>Description:</b> ${description}</p>

<p><b>Contact:</b> ${contact}</p>

${verifyBtn}

`;

container.appendChild(card);

}



// ===============================
// VERIFY OWNER
// ===============================

function verifyOwner(question,secret,name,year,dept,contact,btn){

const answer = prompt(question);

if(answer === null) return;

if(answer.toLowerCase() === secret.toLowerCase()){


alert(

"Owner Verified ✅\n\n"+
"Please contact the owner to claim the item.\n\n"+
"Name: " + name + "\n"+
"Year: " + year + "\n"+
"Department: " + dept + "\n"+
"Contact: " + contact

);


// Change button to claimed
btn.innerText = "Claimed ✅";
btn.style.background = "green";
btn.disabled = true;

}else{

alert("Wrong Answer");

}

}


// ===============================
// SEARCH ITEMS
// ===============================

function filterItems(){

const input = document.getElementById("searchInput").value.toLowerCase();

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

const text = card.innerText.toLowerCase();

card.style.display = text.includes(input) ? "block" : "none";

});

}



// ===============================
// PAGE LOAD
// ===============================

window.onload = loadItems;