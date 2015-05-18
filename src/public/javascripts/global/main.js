require(['material', 'jquery'], function (material, $) {
    material.init();


    $("#use").click(function(){
        $("#use").attr("disabled", "disabled");
        $("#use").html("Uploading...");
        return true;
    });
});