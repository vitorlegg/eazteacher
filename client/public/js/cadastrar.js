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