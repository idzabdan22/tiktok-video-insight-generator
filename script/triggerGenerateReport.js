const makeCleanRequest = async (url) => {
  const response = await axios.get(url);
  const dom = new DOMParser().parseFromString(response.data, "text/html");
  const target_str = dom.getElementById(
    "__UNIVERSAL_DATA_FOR_REHYDRATION__"
  ).innerHTML;
  return JSON.parse(target_str);
};

const makeDirtyRequest = async (url) => {
  try {
    const response = await axios.get(url);
    const dom = new DOMParser().parseFromString(response.data, "text/html");
    const target_str = dom.getElementById(
      "__UNIVERSAL_DATA_FOR_REHYDRATION__"
    ).innerHTML;
    const jsonRes = JSON.parse(target_str);
    const true_url = jsonRes["__DEFAULT_SCOPE__"]["seo.abtest"]["canonical"];
    const converted = true_url.split("/");
    return converted.includes("photo")
      ? [
          `https://${converted[2]}/${converted[3]}/`,
          `https://${converted[2]}/${converted[3]}/video/${converted[5]}`,
          `${converted[3]}`,
        ]
      : [
          `https://${converted[2]}/${converted[3]}/`,
          true_url,
          `${converted[3]}`,
        ];
  } catch (error) {
    console.log(`${url} => video not available or not a valid tiktok link!`);
  }
};

const convertToDate = (unixTimeInSeconds) => {
  const created_date = new Date(unixTimeInSeconds * 1000);
  return `${created_date.getDate()}-${
    Number(created_date.getMonth() + 1) < 10
      ? "0" + (created_date.getMonth() + 1)
      : created_date.getMonth() + 1
  }-${created_date.getFullYear()}`;
};

setTimeout(async () => {
  const downloadButton = document.getElementById("download-button");

  const infoText = document.getElementById("info");
  infoText.style["opacity"] = 1;

  const loadingText = document.getElementById("loadingInfo");

  const t_body = document.getElementById("tableBody");
  t_body.innerHTML = null;

  try {
    let klist = localStorage.getItem("klist");
    klist = klist.split(",");

    const progressBar = document.getElementById("pbar");
    const eachProgressVal = 100 / klist.length;

    let progressCount = 0;
    progressBar.style["width"] = `${progressCount}%`;
    let toBeWritten = {};
    let retry = 0;

    for (let i = 0; i < klist.length; i++) {
      try {
        const [profileURL, videoURL, username] = await makeDirtyRequest(
          klist[i].trim()
        );
        try {
          const responseVideo = await makeCleanRequest(videoURL);
          const created_date =
            responseVideo["__DEFAULT_SCOPE__"]["webapp.video-detail"][
              "itemInfo"
            ]["itemStruct"]["createTime"];
          const statsVideo =
            responseVideo["__DEFAULT_SCOPE__"]["webapp.video-detail"][
              "itemInfo"
            ]["itemStruct"]["stats"];
          try {
            const responseProfile = await makeCleanRequest(profileURL);
            const statsProfile =
              responseProfile["__DEFAULT_SCOPE__"]["webapp.user-detail"][
                "userInfo"
              ]["stats"];
            toBeWritten = {
              no: i + 1,
              date_to_post: convertToDate(created_date),
              user_name: username.slice(1),
              followers: statsProfile["followerCount"],
              video_link: klist[i].trim(),
              view: statsVideo["playCount"],
              like: statsVideo["diggCount"],
              comment: statsVideo["commentCount"],
              share: statsVideo["shareCount"],
              saved: Number(statsVideo["collectCount"]),
            };
          } catch (error) {
            toBeWritten = {
              no: i + 1,
              date_to_post: convertToDate(created_date),
              user_name: null,
              followers: null,
              video_link: klist[i].trim(),
              view: statsVideo["playCount"],
              like: statsVideo["diggCount"],
              comment: statsVideo["commentCount"],
              share: statsVideo["shareCount"],
              saved: Number(statsVideo["collectCount"]),
              note: "Username has been changed!",
            };
            console.log("Username changed!");
          }
        } catch (error) {
          if (retry < 3) {
            retry++;
            console.log(`Retrying...${retry}`);
            i--;
          } else {
            toBeWritten = {
              no: i + 1,
              date_to_post: null,
              user_name: null,
              followers: null,
              video_link: klist[i].trim(),
              view: null,
              like: null,
              comment: null,
              share: null,
              saved: null,
              note: "Tiktok video not available or not a valid tiktok video!",
            };
            console.log("Video tiktok link error!");
            retry = 0;
          }
        }
      } catch (error) {
        toBeWritten = {
          no: i + 1,
          date_to_post: null,
          user_name: null,
          followers: null,
          video_link: klist[i].trim(),
          view: null,
          like: null,
          comment: null,
          share: null,
          saved: null,
          note: "Not a tiktok link!",
        };
      }
      if (retry === 0) {
        addRow(toBeWritten);
        progressCount = progressCount + eachProgressVal;
        progressBar.innerText = `${progressCount.toFixed(0)}%`;
        progressBar.style["width"] = `${progressCount}%`;
      }
    }
    setTimeout(() => {
      loadingText.innerText = "Finished, ready to download!";
      infoText.style["opacity"] = 0;
      downloadButton.style["display"] = "block";
    }, 550);
  } catch (error) {
    if (!localStorage.getItem("klist")) {
      alert("Failed generating report!");
      window.location.replace("/main.html");
    } else {
      // console.log("ERROR");
    }
  }
}, 1000);
