const express = require("express");
const axios = require("axios");
const request = require("request");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();

app.use(express.json());
app.use(cors());

// server running verification
app.get("/server-test", (req, res) => res.send("server is fine"));

// 음성 인식 API
app.post("/upload/:languageCode", upload.single("audio"), (req, res, next) => {
  const openApiUrl = "http://aiopen.etri.re.kr:8000/WiseASR/Recognition";
  const access_key = process.env.ETRI_KEY;
  const language_code = req.params.languageCode;
  const reqJSON = {
    access_key,
    argument: {
      language_code,
      audio: req.file.buffer.toString("base64"),
    },
  };

  axios({
    method: "post",
    url: openApiUrl,
    data: JSON.stringify(reqJSON),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  }).then(({ data }) => {
    res.json(data);
  });
});

// 파파고 번역 API
app.post("/translate/:languageCode", (req, res, next) => {
  const client_id = process.env.NAVER_ID;
  const client_secret = process.env.NAVER_SECERT;
  const api_url = "https://openapi.naver.com/v1/papago/n2mt";
  const language_code = req.params.languageCode;
  const papago_lang = {
    english: "en",
    japanese: "ja",
    chinese: "zh-CN",
    spanish: "es",
    french: "fr",
    german: "de",
    russian: "ru",
    vietnam: "vi",
  };
  const text = req.body.rawString;
  const options = {
    url: api_url,
    form: { source: papago_lang[language_code], target: "ko", text },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      res.end(body);
    } else {
      res.status(response.statusCode).end();
    }
  });
});

// 형태소 분석 API
app.post("/disassemble/:tag", (req, res, next) => {
  const tag = req.params.tag;
  const openApiUrl =
    tag === "문어"
      ? "http://aiopen.etri.re.kr:8000/WiseNLU"
      : "http://aiopen.etri.re.kr:8000/WiseNLU_spoken";
  const access_key = process.env.ETRI_KEY;
  const analysis_code = "morp";
  const text = req.body.text;
  const reqJSON = {
    access_key,
    argument: {
      text,
      analysis_code,
    },
  };
  const options = {
    url: openApiUrl,
    body: JSON.stringify(reqJSON),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };
  request.post(options, function (error, response, body) {
    res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
    res.end(body);
  });
});

// 어휘 정보 API
app.post("/define", (req, res, next) => {
  const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/Word";
  const access_key = process.env.ETRI_KEY;
  const word = req.body.word;
  const requestJson = {
    access_key,
    argument: {
      word,
    },
  };
  const options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };
  request.post(options, function (error, response, body) {
    res.end(body);
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 4000);
