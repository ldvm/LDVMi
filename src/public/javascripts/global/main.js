require(['material', 'jquery'], function (material, $) {
    material.init();

    $("form#ttldl").submit(function(){
        console.log("dfg");
        $("#use").attr("disabled", "disabled");
        $("#use").html("Uploading...");
    });
});