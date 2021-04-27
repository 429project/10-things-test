const header = document.getElementById('header');
const footer = document.getElementById('footer');
const qna = document.getElementById('qna');
const u_name = document.querySelector('input[type=text]');
const wrap = document.getElementById('wrap');
const tabletMQL = window.matchMedia("all and (min-width: 768px)");
const pcMQL = window.matchMedia("all and (min-width: 1024px)");
const ENDPOINT = 12;
const select = [];
let qIdx = -1;

const url = 'https://429project.github.io/dance-type-test';

const copy = () => {
  const tmp = document.createElement('textarea');
  document.body.appendChild(tmp);
  tmp.value = url;
  tmp.select();
  document.execCommand('copy');
  document.body.removeChild(tmp);
}

const calcScore = () => {
  let point = 0;
  for (let i = 0; i < ENDPOINT; i++) {
    digit = 10 ** (Math.floor((ENDPOINT - i - 1) / 3));
    point += qnaList[i].a[select[i]].score * digit ;
  }
  console.log(point);
  return point;
}

const sortResult = (point) => {
  let mbti = "";
  if (point >= 2000) {
    mbti += "E";
  } else {
    mbti += "I";
  }

  if (point % 1000 >= 200) {
    mbti += "N";
  } else {
    mbti += "S";
  }

  if (point % 100 >= 20) {
    mbti += "T";
  } else {
    mbti += "F";
  }

  if (point % 10 >= 2) {
    mbti += "J";
  } else {
    mbti += "P"
  }

  console.log(mbti);

  let grade = -1;

  if (mbti == "ISFJ") {
    grade = 0;
  } else if (mbti == "ISTJ" || mbti == "ESTJ") {
    grade = 1;
  } else if (mbti == "INTP" || mbti == "ISTP") {
    grade = 2;
  } else if (mbti == "ISFP" || mbti == "ESFJ") {
    grade = 3;
  } else if (mbti == "INTJ") {
    grade = 4;
  } else if (mbti == "ENTJ" || mbti == "ENFP") {
    grade = 5;
  } else if (mbti == "INFP" || mbti == "INFJ") {
    grade = 6;
  } else if (mbti == "ESTP" || mbti == "ENFJ") {
    grade = 7;
  } else if (mbti == "ESFP") {
    grade = 8;
  } else {
    grade = 9;
  } 

  return grade;
}

const goResult = () => {
  if (pcMQL.matches) {
    console.log('PC');
    wrap.style.marginTop = '150px';
  } else if (tabletMQL.matches) {
    console.log('tablet');
    wrap.style.marginTop = '115px';
  }

  const result = document.getElementById('result');
  const point = calcScore();
  const grade = sortResult(point);
  // const pTitle = document.querySelector('.p');
  // const res_point = document.querySelector('.point');
  // const pin = document.querySelector('.pin');
  const img_url = 'img/image-' + grade + '.png';
  const res_img = document.createElement('img');
  const res_img_div = document.querySelector('.art');
  const dance_type = document.querySelector('.result');
  const comment = document.querySelector('.comment');
  const desc = document.querySelector('.res');

  res_img.src = img_url;
  res_img.alt = infoList[grade].name;
  res_img.title = infoList[grade].name;
  res_img_div.appendChild(res_img);
  dance_type.innerHTML = infoList[grade].name;
  comment.innerHTML = infoList[grade].comment;
  desc.innerHTML = infoList[grade].desc;

  setTimeout(() => {
    header.style.display = 'block';
    footer.style.display = 'block';
    result.style.display = 'block';
    header.style.animation =
      'fade-in 0.3s forwards';
    footer.style.animation =
      'fade-in 0.3s forwards';
    result.style.animation =
      'going-up 0.5s, ' +
      'fade-in 0.5s forwards';
  }, 600);

}

const end = () => {
  qna.style.animation = '';
  const interval = setInterval(() => {
    qna.style.opacity -= 0.1;
    qna.style.transform = 'translateY(-1px)';
  }, 50);
  setTimeout(() => clearTimeout(interval), 500);
  setTimeout(() => qna.style.display = 'none', 500);
  setTimeout(() => {
    const calc = document.getElementById('calc');
    calc.style.display = 'block';
    calc.style.animation =
      'going-up 0.5s forwards, ' +
      'fade-in 0.5s forwards';
  }, 700);
  setTimeout(() => {
    calc.style.animation = '';
    calc.style.animation =
      'going-left 0.4s forwards, ' +
      'fade-out 0.4s forwards';
    setTimeout(() => {
      calc.style.display = 'none';
      goResult();
    }, 400);
  }, 5000);
}

const addAnswer = (answerTxt, idx) => {
  const answer = document.createElement('button');
  const a = document.querySelector('.answer');
  answer.className += 'a box';
  answer.innerHTML = answerTxt;
  answer.addEventListener('click', () => {
    const parent = answer.parentNode;
    const children = parent.childNodes;
    for (let i in children) {
      children[i].disabled = true;
    }
    parent.classList.add('fade-out-5-4');
    setTimeout(() => {
      select[qIdx] = idx;
      a.innerHTML = '';
      parent.classList.remove('fade-out-5-4');
      goNext();
    }, 800);
  });

  setTimeout(() => answer.style.animation =
    'going-down 0.25s forwards, fade-in 0.25s forwards', 50);
  a.appendChild(answer);
}


const goNext = () => {
  if (qIdx++ === qnaList.length - 1) {
    end();
    return;
  }

  const status = document.querySelector('.status');
  const qNum = qnaList[qIdx];
  const q = document.querySelector('.q');

  status.style.width = ((qIdx + 1) / ENDPOINT * 100) + '%';
  q.innerHTML = qNum.q;
  qna.style.animation =
    'fade-in 0.3s ease-in-out 0.4s forwards, ' +
    'going-down 0.3s ease-in-out 0.4s forwards';

  setTimeout(() => {
    const endIdx = qNum.a.length - 1;
    for (let i in qNum.a) {
      addAnswer(qNum.a[i].answer, i);
    }
    qna.style.opacity = 1;
  }, 700);
}

const begin = () => {
  const welcome = document.getElementById('welcome');
  header.style.animation =
    'going-up 0.4s forwards, ' +
    'fade-out 0.4s forwards';
  footer.style.animation =
    'going-down 0.4s forwards, ' +
    'fade-out 0.4s forwards';
  setTimeout(() => welcome.style.animation =
    'going-up 0.4s ease-in-out forwards, ' +
    'fade-out 0.4s ease-in-out forwards', 500);
  setTimeout(() => {
    header.style.display = 'none';
    footer.style.display = 'none';
    welcome.style.display = 'none';
    qna.style.display = 'block';
    if (pcMQL.matches) {
      console.log('PC');
      wrap.style.marginTop = '50px';
    } else if (tabletMQL.matches) {
      console.log('tablet');
      wrap.style.marginTop = '30px';
    }
    goNext();
  }, 1000);
}

const load = () => {
  const start_btn = document.querySelector('.start');
  start_btn.addEventListener('click', () => {
    start_btn.disabled = true;
    begin();
  });
}

window.onload = load();