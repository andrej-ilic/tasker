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
  let color = form.color.value ? form.color.value : '';
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}`,
    data: { taskId, title, content, color }
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

function deleteGroup(groupId) {
  let willDelete = confirm('Are you sure you want to delete this group?');
  if (willDelete) {
    $.ajax({
      type: 'delete',
      url: `/groups/${groupId}/delete`
    });
  } else {
    return willDelete;
  }
}

function addBio() {
  $('#addBioButton').hide('fast');
  $('#addBioForm').show('fast');
}

function addBioCancel() {
  $('#addBioButton').show('fast');
  $('#addBioForm').hide('fast');
}