const themeBtn = document.querySelector(".toggle-btn");
const themeIcon = document.querySelector(".theme-icon");

const wordSearch = document.querySelector(".word-search");
const phoneticSearch = document.querySelector(".phonetic-search");
const wordAndAudio = document.querySelector(".word-and-play-btn");

const search = document.getElementById("search");

const firstPartOfSpeech = document.querySelector(".first-part");
const secondPartOfSpeech = document.querySelector(".second-part");
const firstMeaningContainer = document.getElementById("first-meaning");
const synonymsOneContainer = document.querySelector(".synonyms-one");
const secondMeaningContainer = document.getElementById("second-meaning");
const synonymsTwoContainer = document.querySelector(".synonyms-two");

const sourcelink = document.querySelector(".source-link");
const resultContainer = document.querySelector(".result");
const playButton = document.querySelector(".play-btn");
const input = document.getElementById("input");

const selectItem = document.querySelector(".select");
const dropdown = document.querySelector(".selected");
const warningText = document.querySelector(".warning");

search.addEventListener("submit", (e) => {
  e.preventDefault();

  warningText.textContent = `Please Wait...`;
  warningText.classList.remove("hide");
  resultContainer.classList.add("hide");

  if (input.value == "") {
    warningText.classList.remove("hide");
    warningText.textContent = `Input field can't be empty`;
    return;
  }

  fetchMeaning();
});

async function fetchMeaning() {
  try {
    firstMeaningContainer.innerHTML = "";
    synonymsOneContainer.innerHTML = "";
    secondMeaningContainer.innerHTML = "";
    synonymsTwoContainer.innerHTML = "";

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${input.value}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.log("an error occur");
      return;
    }
    const data = await response.json();

    let [result] = data;

    const { word, phonetic, meanings, sourceUrls } = result;
    const [firstMeaning, secondMeaning] = meanings;
    const {
      partOfSpeech: partOfSpeechOne,
      definitions: definitionsOne,
      synonyms: synonymsOne,
      antonyms: antonymsOne,
    } = firstMeaning;

    const {
      partOfSpeech: partOfSpeechTwo,
      synonyms: synonymsTwo,
      definitions: definitionsTwo,
    } = secondMeaning;

    wordSearch.textContent = word;
    if (phonetic == "") {
      phoneticSearch.classList.add("hide");
    } else {
      phoneticSearch.textContent = phonetic;
    }

    firstPartOfSpeech.textContent = partOfSpeechOne;
    secondPartOfSpeech.textContent = partOfSpeechTwo;

    definitionsOne.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      listItem.textContent = item.definition;
      firstMeaningContainer.appendChild(listItem);
    });

    if (synonymsOne.length > 0) {
      synonymsOne.forEach((item) => {
        const list = document.createElement("li");
        list.textContent = item;
        synonymsOneContainer.appendChild(list);
      });
    }

    definitionsTwo.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      listItem.textContent = item.definition;
      secondMeaningContainer.appendChild(listItem);

      if (item.example) {
        console.log(item.example);
        let exampleElement = document.createElement("span");
        listItem.appendChild(exampleElement);
        exampleElement.textContent = `"${item.example}"`;
      }
    });

    if (synonymsTwo.length > 0) {
      synonymsTwo.forEach((item) => {
        const list = document.createElement("li");
        list.textContent = item;
        synonymsTwoContainer.appendChild(list);
      });
    }

    sourcelink.setAttribute("href", sourceUrls[0]);
    sourcelink.textContent = sourceUrls[0];

    document.querySelector(".warning").classList.add("hide");

    resultContainer.classList.remove("hide");
    playButton.classList.remove("hide");
    warningText.classList.add("hide");
  } catch {
    (error) => {
      console.log(error);
    };
  }
}

themeBtn.addEventListener("click", () => {
  themeBtn.classList.toggle("active");
  document.body.classList.toggle("dark-theme");

  if (themeBtn.classList.contains("active")) {
    themeIcon.setAttribute("src", "images/half-moon.svg");
  } else {
    themeIcon.setAttribute("src", "images/sun.svg");
  }
});

dropdown.addEventListener("click", () => {
  selectItem.classList.toggle("hide");

  const options = document.querySelectorAll(".select-item");
  const selectedFont = document.querySelector(".selected-font");
  const caret = document.querySelector(".caret");

  caret.classList.toggle("rotate");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      let innerContent = option.textContent;
      let newSelectFont = `${innerContent}, sans-serif`;

      document.body.style.fontFamily = newSelectFont;

      selectedFont.textContent = innerContent;
      selectItem.classList.add("hide");

      options.forEach((item) => {
        item.classList.remove("selected-active");
      });

      option.classList.add("selected-active");
      caret.classList.remove("rotate");
    });
  });
});
