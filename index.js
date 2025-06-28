document.addEventListener("DOMContentLoaded", () => {
  const dogTableBody = document.getElementById("table-body");
  const dogForm = document.getElementById("dog-form");

  let currentDogId = null;

  // Fetch and display all dogs
  function loadDogs() {
    fetch("http://localhost:3000/dogs")
      .then((res) => res.json())
      .then((dogs) => {
        dogTableBody.innerHTML = ""; // clear table
        dogs.forEach((dog) => renderDogRow(dog));
      });
  }

  // Create and append a table row for each dog
  function renderDogRow(dog) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td><button data-id="${dog.id}">Edit</button></td>
    `;

    tr.querySelector("button").addEventListener("click", () => {
      // Pre-fill the form
      dogForm.name.value = dog.name;
      dogForm.breed.value = dog.breed;
      dogForm.sex.value = dog.sex;
      currentDogId = dog.id;
    });

    dogTableBody.appendChild(tr);
  }

  // Submit updated dog data
  dogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentDogId) return;

    const updatedDog = {
      name: dogForm.name.value,
      breed: dogForm.breed.value,
      sex: dogForm.sex.value,
    };

    fetch(`http://localhost:3000/dogs/${currentDogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDog),
    })
      .then((res) => res.json())
      .then(() => {
        dogForm.reset();
        currentDogId = null;
        loadDogs(); // refresh updated list
      });
  });

  loadDogs(); // Initial load
});
