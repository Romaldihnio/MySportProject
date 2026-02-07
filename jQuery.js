$('.card-container').on('click', '.desc-btn', function(){
    let btn = $(this)
    let card = btn.closest('.card')
    let content = card.find('.card-bottom')

    $('.card-container .card-bottom').not(content).slideUp()
    $('.card-contsainer .desc-btn').not(btn).removeClass('active')

    content.slideToggle()
    btn.toggleClass('active')
})