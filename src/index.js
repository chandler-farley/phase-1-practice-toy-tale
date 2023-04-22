let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// fetch and create toy cards
let divTC = document.getElementById("toy-collection")

let likeArr = []

function buildCard(elem) {
    let toyCard = document.createElement('div')
    toyCard.className = "card"
    let toyH2 = document.createElement('h2')
    toyH2.textContent = elem.name
    let toyImg = document.createElement('img')
    toyImg.src = elem.image
    toyImg.className = "toy-avatar"
    let toyP = document.createElement("p")
    toyP.textContent = `${elem.likes} Likes`
    let toyBtn = document.createElement("button")
    toyBtn.className = "like-btn"
    toyBtn.id = elem.id
    toyBtn.textContent = "Like ♥"
    toyBtn.value = elem.likes
    toyCard.appendChild(toyH2)
    toyCard.appendChild(toyImg)
    toyCard.appendChild(toyP)
    toyCard.appendChild(toyBtn)
    divTC.appendChild(toyCard)
    likeArr.push(toyBtn)
}

async function fetchToys() {
  const res = await fetch('http://localhost:3000/toys')
  const json = await res.json()
  json.forEach(elem => buildCard(elem))
}

async function showLikes() {
  await fetchToys()
  likeArr.forEach(ele => {
    ele.addEventListener('click', butt)
  })
}
showLikes()

// post new toys
function addNewToy(name, url) {
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "image": url,
      "likes": 0
    })
  })
  .then(res => res.json())
  .then(obj => buildCard(obj))
}

let submitBtn = document.querySelector('.add-toy-form')
submitBtn.addEventListener('submit', e => {
  e.preventDefault()
  let inputName = document.getElementsByClassName('input-text')[0].value
  let inputURL = document.getElementsByClassName('input-text')[1].value
  addNewToy(inputName, inputURL)
})

// render likes
function butt(e) {
  targetID = e.target.id
  let upcounter = e.target.value
  upcounter++
  e.target.value = upcounter
  let newLikes = parseInt(e.target.value)
  likePatcher(targetID, newLikes)
}

function likePatcher(id, newNumberOfLikes) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  })
  .then(res => res.json())
  .then(obj => {
    let btnTarget = document.getElementById(`${id}`)
    let patchedLikes = btnTarget.previousElementSibling
    patchedLikes.textContent = `${obj.likes} Likes`
  })
}