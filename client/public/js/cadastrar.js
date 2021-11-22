$('input[name=password]').on('change',()=>{
    if(($('input[name=password]').val() != $('input[name=confirmPassword]').val()) && $('input[name=password]').val().length && $('input[name=confirmPassword]').val().length){
        $('#difPass').show()
    }else $('#difPass').hide();
});

$('input[name=confirmPassword]').on('change',()=>{
    if(($('input[name=password]').val() != $('input[name=confirmPassword]').val()) && $('input[name=password]').val().length && $('input[name=confirmPassword]').val().length){
        $('#difPass').show()
    }else $('#difPass').hide();
});

$('form').on('submit',(e)=>{
  if($('input[name=password]').val() != $('input[name=confirmPassword]').val()){
    e.preventDefault();
  }
});

$('#cadastrar').on('submit',(e)=>{
  if($('input[name=password]').val() == $('input[name=confirmPassword]').val()){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: '/cadastrar',
      data: {
        email:$(`#${e.currentTarget.id} input[name=email]`).val(),
        password:$(`#${e.currentTarget.id} input[name=password]`).val(), 
        confirmPassword:$(`#${e.currentTarget.id} input[name=confirmPassword]`).val(), 
        firstName:$(`#${e.currentTarget.id} input[name=firstName]`).val(), 
        lastName:$(`#${e.currentTarget.id} input[name=lastName]`).val()
      },
      success: (response) => {
        if (response.result == 'redirect') {
          //redirecting to main page from here.
          window.location.replace(response.url);
        }if (response.result == 'errado') {
          $(".invalid-feedback").css("display", "block");
        } 
      },
      error: (result) =>{
          alert("Data not found");
      }
    });
  }
}); 