const url = "https://wger.de/api/v2/exercise/?language=2"
async function findExerciseIds(){
    await fetch(url)
    .then ((response) => {
        if(!response.status.ok){
            if(response.status == 404){ 
                alert("Упражнения не найдены")
                 console.error("Error: " + response.status)
            }

            if(response.status === 500){ 
                alert("Поиск не доступен")
                 console.error("Error: " + response.status)}
           
        }
        return response
    })
    .then(response => response.json())
    .then(data => {
       console.log(data)
       const ids = data.results.map(ex => ex.id)
       console.log(ids)
    })
}
findExerciseIds()
