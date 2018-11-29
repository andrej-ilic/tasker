function finishTask(taskId) {
  let url = window.location.href;
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}/finish`,
    complete: () => {
      window.location.reload();
    }
  });
}

function undoTask(taskId) {
  let url = window.location.href;
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}/undo`,
    complete: () => {
      window.location.reload();
    }
  });
}

function deleteTask(taskId) {
  let url = window.location.href;
  $.ajax({
    type: 'delete',
    url: `/tasks/${taskId}`,
    data: { taskId },
    complete: () => {
      window.location.reload();
    }
  });
}

function editTask(taskId) {
  let form = $(`#editForm${taskId}`)[0];
  let title = form.title.value.trim();
  let content = form.content.value.trim();
  let color = form.color.value ? form.color.value : '';
  let url = window.location.href;
  $.ajax({
    type: 'put',
    url: `/tasks/${taskId}`,
    data: { taskId, title, content, color },
    complete: () => {
      window.location.reload();
    }
  });
}

function updateBio() {
  let biography = $('#biography').val().trim();
  let url = window.location.href;
  $.ajax({
    type: 'put',
    url: '/users/bio',
    data: { biography },
    complete: () => {
      window.location.reload();
    }
  });
}

function deleteGroup(groupId) {
  let willDelete = confirm('Are you sure you want to delete this group?');
  let url = window.location.href;
  if (willDelete) {
    $.ajax({
      type: 'delete',
      url: `/groups/${groupId}/delete`,
      complete: () => {
        window.location.href = '/groups';
      }
    });
  } else {
    return willDelete;
  }
}