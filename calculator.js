var atkType;
var defType1;
var defType2;
var defense;
var armorReduction;
var baseDmg;
var atk;
var effectiveness = 1;
var url = "https://pokeapi.co/api/v2/type/"

$(document).ready(function() {
  $("#formulaOutput").hide();
  $("#calculate").click(function() {
    getData();
    atkType = $("#attack_type").val();
    defense = $("#defense").val();
    armorReduction = $("#armorReduction").val();
    baseDmg = $("#attack").val();
    atk = $("#atk").val();
    totalDmg = 0;
    effectiveness = 1;
    if ($("#halfResist").prop('checked') == true) {
      baseDmg /= 2;
    }
  });

  $("#formulaButton").click(function() {
    if ($("#formulaOutput").is(":hidden")) {
      $("#formulaOutput").show();
    } else {
      $("#formulaOutput").hide();
    }
  });

  $("#attack_type").change(function() {
    var newClass = 'pksymbol pksymbol-type-' + $('#attack_type').val() + '-32px';
    $("#atkType").attr('class', newClass);
  });

  $("#defType1").change(function() {
    var newClass = 'pksymbol pksymbol-type-' + $('#defType1').val() + '-32px';
    $("#def1").attr('class', newClass);
  });

  $("#defType2").change(function() {
    if ($('#defType2') != 'none') {
    var newClass = 'pksymbol pksymbol-type-' + $('#defType2').val() + '-32px';
    $("#def2").attr('class', newClass);
  } else {
    $("#def2").attr('class', '');
  }
  });
});

  let getData = () => {
    const defType1URL = url + $("#defType1").val();
    const defType2URL = url + $("#defType2").val();

    fetch(defType1URL).then((response) => response.json())
    .then((type) => {getEffectiveness(type)});

    if ($("#defType2").val() != "none") {
      fetch(defType2URL).then((response) => response.json())
      .then((type) => {getEffectiveness(type)});
    }
  }

  let getEffectiveness = (type) => {
    for (let x in type.damage_relations.double_damage_from) {
      if (atkType == type.damage_relations.double_damage_from[x].name) {
        effectiveness += .5;
      }
    } for (let x in type.damage_relations.half_damage_from) {
      if (type.damage_relations.half_damage_from[x] != null && atkType == type.damage_relations.half_damage_from[x].name) {
        if (effectiveness == 1.5) {
          effectiveness = 1;
        } else {
          effectiveness /= 2;
        }
      }}
      for (let x in type.damage_relations.no_damage_from) {
        if (type.damage_relations.no_damage_from[x] != null && atkType == type.damage_relations.no_damage_from[x].name) {
        effectiveness = 0;
      }
    }

  let formula = "( " + baseDmg + " - " + defense + " - " + armorReduction + " ) " + " * " + effectiveness;
  $("#formulaOutput").text(formula);
  totalDmg = Math.floor((baseDmg - defense - armorReduction) * effectiveness);
  if (totalDmg < 0 ) {
    totalDmg = 0;
  }

  $("#totaldmg").text(totalDmg);
}
