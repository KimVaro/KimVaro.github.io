var brand = document.getElementById("brand");
var model = document.getElementById("model");
var subModel = document.getElementById("subModel");

var car_data = {
    "혼다": {
        "시빅": ["LX", "LX CVT", "Sport", "Sport CVT"],
        "어코드": ["기본", "터보 스포츠"],
        "CR-V 하이브리드": ["EX-L 2WD", "EX-L 4WD", "Touring 4WD"]
    },
    "쉐보레": {
        "말리부": ["더 뉴 말리부", "올 뉴 말리부", "말리부"],
        "크루즈": ["올 뉴 크루즈", "어메이징 뉴 크루즈", "크루즈"],
        "스파크": ["더 뉴 스파크", "더 넥스트 스파크", "스파크 EV", "스파크"]

    }
}

let cars = Object.keys(car_data);
createOption(cars, brand);
selectFirst();

function selectFirst() {
    model.innerHTML = "";
    let models = Object.keys(car_data[brand.value]);
    createOption(models, model);
    selectSecond();
}

function selectSecond() {
    subModel.innerHTML = "";
    let subModels = Object.values(car_data[brand.value][model.value]);
    createOption(subModels, subModel);
}

function createOption(arr, s) {
    arr.forEach(o => {
        let opt = document.createElement("option");
        opt.value = o;
        opt.innerHTML = o;
        s.add(opt);
    });
}