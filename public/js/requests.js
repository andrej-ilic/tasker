function finishTask(taskId) {
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}/finish`,
  });
}

function undoTask(taskId) {
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}/undo`
  });
}

function deleteTask(taskId) {
  $.ajax({
    type: 'delete',
    url: `/tasks/${taskId}`,
    data: { taskId }
  });
}

function editTask(taskId) {
  let form = $(`#editForm${taskId}`)[0];
  let title = form.title.value.trim();
  let content = form.content.value.trim();
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}`,
    data: { taskId, title, content }
  });
}

function updateBio() {
  let biography = $('#biography').val().trim();
  $.ajax({
    type: 'put',
    url: '/users/bio',
    data: { biography }
  });
}

function addBio() {
  $('#addBioButton').hide('fast');
  $('#addBioForm').show('fast');
}

function addBioCancel() {
  $('#addBioButton').show('fast');
  $('#addBioForm').hide('fast');
}