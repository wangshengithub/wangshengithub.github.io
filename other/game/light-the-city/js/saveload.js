function deep_clone(a, b) {
  if (b === undefined) return;
  if (typeof b === "object") {
    for (const key in b) {
      if (!b.hasOwnProperty(key)) continue;
      if (a[key] === undefined) {
        a[key] = {};
      }
      if (typeof b[key] !== "object") a[key] = b[key];
      else deep_clone(a[key], b[key]);
    }
  }
  else a = b;
}

function save() {
  let saveplayer = {};
  deep_clone(saveplayer, player);
  return btoa(JSON.stringify(saveplayer));
}

function load(savegame) {
  deep_clone(player, JSON.parse(atob(savegame)));
  first_loop();
}

function save_local() {
  localStorage.setItem("lightthecity_gamesave", save());
}

function load_local() {
  if (localStorage.hasOwnProperty("lightthecity_gamesave")) {
    load(localStorage.getItem("lightthecity_gamesave"));
  }
}

function hard_reset() {
  localStorage.removeItem("lightthecity_gamesave");
  player.reset();
}

// Nicely versions of above

function export_nicely() {
  document.getElementById("modal_export").style.display = "";
  document.getElementById("export_textarea").value = save();
}

function import_nicely() {
  document.getElementById("modal_import").style.display = "";
}

function restore_nicely() {
  document.getElementById("modal_restore").style.display = "";
}

function reset_nicely() {
  document.getElementById("modal_reset").style.display = "";
}

function import_save() {
  let backup = save();
  try {
    load(document.getElementById("import_textarea").value);
  }
  catch {
    load(backup);
  }
  document.getElementById("import_textarea").value = "";
  close_modal();
}

function reset_game() {
  localStorage.setItem("lightthecity_gamebackup", save());
  hard_reset();
  close_modal();
  switch_tab('power');
  first_loop();
}

function restore_from_backup() {
  load(localStorage.getItem("lightthecity_gamebackup"));
  close_modal();
}

function delete_backup() {
  localStorage.removeItem("lightthecity_gamebackup");
  close_modal();
}

function close_modal() {
  let elements = document.getElementsByClassName("modal");
  for (let i = 0; i < elements.length; i++)
    elements.item(i).style.display = "none";
}