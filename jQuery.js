$(document).ready(function(){
    $('.desc-btn').click(function(){
        $(this).closest('.card').find('.card-bottom').slideToggle()
    })
})