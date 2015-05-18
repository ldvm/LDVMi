require(['material', 'jquery'], function (material, $) {
    material.init();


    $("#use").parent(.click(function(){
        $("#use").attr("disabled", "disabled");
        $("#use").html("Uploading...");
        $("#use").parents("form").submit();
    });
});