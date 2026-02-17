const api = "https://api.api-ninjas.com/v1/exercises"
const api_key = "" //api ключ с exercises api
const container = document.querySelector(".card-container")
import translate from './node_modules/translate/index.min.js'
translate.engine = 'google'//способ перевода(яндекс и deepl требуют ключа)
let lang = 'ru' //язык для перевода
async function checkJson(response){
    if(api_key === ""){
        container.innerHTML = `<p class="error-text">Пустой api ключ!</p>`
    }
    if(!response.ok){
        const text = await response.text().catch(() => '')
        alert(response.status + text)
        throw new Error(response.status + text)
    }
    return response.json()
}
getData()
function filtersChange(){
    const muscle_input = document.querySelector("#filter-muscle")
    const difficulty_input = document.querySelector("#filter-difficulty")
    const type_input = document.querySelector("#filter-type")

    muscle_input.addEventListener("change", getData)
    difficulty_input.addEventListener("change", getData)
    type_input.addEventListener("change", getData)
}
async function getData(){
    container.innerHTML = ""
    const muscle_value = document.querySelector("#filter-muscle").value.trim()
    const difficulty_value = document.querySelector("#filter-difficulty").value.trim()
    const type_value = document.querySelector("#filter-type").value.trim()
    const filtered = await fetch(api + `?type=${type_value}&muscle=${muscle_value}&difficulty=${difficulty_value}`, {
        method:"GET",
        headers:{
            "X-Api-Key": api_key
        }
    })
    .then(response => checkJson(response))
    if(!filtered || filtered.length === 0){
        container.innerHTML = `<p class="error-text">Ничего нет. Попробуйте другие фильтры.</p>`
    }
    filtered.forEach(element => {
        getTranslatedExercises(element)
    });
}
async function getTranslatedExercises(text) {
    let img_src = ""
    let type = ""
    if(text.difficulty === "beginner"){
    img_src = "/resourses/images/beginner.png"
    }
    if(text.difficulty === "intermediate"){
    img_src = "/resourses/images/intermediate-logo.png"
    }
    if(text.difficulty === "expert"){
    img_src = "/resourses/images/expert-logo.png"
    }
    if(text.type === "olympic_weightlifting"){
    type = "тяжелая атлетика"
    }else{
    type = await translateText(text.type)
    }
    const translated = {
        name: text.name,
        type: type,
        muscle: await translateText(text.muscle),
        difficulty: await translateText(text.difficulty),
        difficulty_img: img_src,
        instructions: await translateText(text.instructions),
        equipments: await translateText(text.equipments),
        safety_info: await translateText(text.safety_info)
    }
    renderExercises(translated)
}
async function translateText(text) {
    if(!text || text.length === 0){
        return "Ничего нет"
    }
    const textToTranslate = Array.isArray(text) ? text.join(", ") : text
    try {
        return await translate(textToTranslate, lang)
    } catch (error) {
        throw new Error(error)
    }
}
function renderExercises(exercise){
    const fragment = document.createDocumentFragment()
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `
    <div class="card">
                <div class="card-top">
                    <img src="${exercise.difficulty_img}" alt="diff_logo" class="card-img">
                    <ul class="parameter-container">
                      <li class="parameter-text">Название: ${exercise.name}</li>
                      <li class="parameter-text">Группы мышц: ${exercise.muscle}</li>
                      <li class="parameter-text">Сложность: ${exercise.difficulty}</li>
                    </ul>
                </div>
                <div class="desc-btn-container">
                    <p class="desc-btn">Показать/скрыть описание</p>
                </div>
                <div class="card-bottom hidden">
                     <ul class="card-bottom-list">
                        <li class="card-bottom-item">Тип: ${exercise.type}</li>
                        <li class="card-bottom-item">Инструкции: ${exercise.instructions}</li>
                        <li class="card-bottom-item">Оборудование: ${exercise.equipments}</li>
                        <li class="card-bottom-item">Правила безопасности: ${exercise.safety_info}</li>
                     </ul>
                </div>
           </div>
    `
    fragment.appendChild(wrapper)
    container.appendChild(fragment)
}
(async () =>{
    filtersChange()
})()