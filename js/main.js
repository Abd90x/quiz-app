let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanC = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let ansArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let bulletsContainer = document.querySelector(".bullets");
let resultContainer = document.querySelector(".results");
let quizInfo = document.querySelector(".quiz-info");
let countDownDiv = document.querySelector(".countdown");

let currIndex = 0;
let rightAns = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObj = JSON.parse(this.responseText);
      let questionsCount = questionsObj.length;

      createBullets(questionsCount);

      addQuestionData(questionsObj[currIndex], questionsCount);

      countDown(75, questionsCount);

      submitBtn.onclick = () => {
        let trueAns = questionsObj[currIndex]["right_answer"];
        console.log(trueAns);

        currIndex++;

        checkAns(trueAns, questionsCount);

        quizArea.innerHTML = "";
        ansArea.innerHTML = "";

        addQuestionData(questionsObj[currIndex], questionsCount);

        handelBullets();

        clearInterval(countDownInterval);
        countDown(75, questionsCount);

        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "./questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanC.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currIndex < count) {
    let qTitle = document.createElement("h2");

    qTitle.appendChild(document.createTextNode(obj.title));

    quizArea.appendChild(qTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let ansInput = document.createElement("input");
      ansInput.type = "radio";
      ansInput.name = "question";
      ansInput.id = `answer_${i}`;
      ansInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        ansInput.checked = true;
      }

      let ansLabel = document.createElement("label");
      ansLabel.htmlFor = `answer_${i}`;

      ansLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));

      mainDiv.appendChild(ansInput);
      mainDiv.appendChild(ansLabel);
      ansArea.appendChild(mainDiv);
    }
  }
}

function checkAns(rAns, count) {
  let answers = document.getElementsByName("question");
  let theChAns;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChAns = answers[i].dataset.answer;
    }
  }
  if (rAns === theChAns) {
    rightAns++;
  }
}

function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrOfSpan = Array.from(bulletsSpans);
  arrOfSpan.forEach((span, index) => {
    if (currIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let score;
  if (currIndex === count) {
    quizArea.remove();
    ansArea.remove();
    submitBtn.remove();
    bulletsContainer.remove();
    quizInfo.remove();

    if (rightAns > count / 2 && rightAns < count) {
      score = `<span class="good">Good</span> ${rightAns} From ${count}`;
    } else if (rightAns === count) {
      score = `<span class="perfect">Perfect</span> ${rightAns} From ${count}`;
    } else {
      score = `<span class="bad">Bad</span> ${rightAns} From ${count}`;
    }
    resultContainer.innerHTML = score;
    resultContainer.style = `text-align: center; font-size:30px; padding:20px; margin-top:20px`;
    let tryAgainBtn = document.createElement("button");
    tryAgainBtn.appendChild(document.createTextNode("Try Again"));
    tryAgainBtn.className = "submit-btn";
    resultContainer.appendChild(tryAgainBtn);
    tryAgainBtn.onclick = () => {
      location.reload();
    };
  }
}

function countDown(duration, count) {
  if (currIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownDiv.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
