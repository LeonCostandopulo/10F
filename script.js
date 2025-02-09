document.addEventListener("DOMContentLoaded", () => {
  // Función para alternar la visualización del mensaje secreto y cambiar el texto del botón
  const revealButton = document.getElementById("reveal-button");
  revealButton.addEventListener("click", function() {
    const hiddenMessage = document.getElementById("hidden-message");
    if (hiddenMessage.style.display === "none" || hiddenMessage.style.display === "") {
      hiddenMessage.style.display = "block";
      this.textContent = "Ocultar mensaje secreto";
    } else {
      hiddenMessage.style.display = "none";
      this.textContent = "Descubrir mensaje secreto";
    }
  });

  // Función que actualiza el contenedor de recuerdos para una entrada
  function updateUserMemories(entryDiv, memories, entryIndex) {
    const container = entryDiv.querySelector(".user-memories");
    container.innerHTML = "";
    memories.forEach((memory, memIndex) => {
      // Creamos el contenedor de cada recuerdo
      const memoryDiv = document.createElement("div");
      memoryDiv.className = "memory-item";
      
      // Elemento para mostrar el texto del recuerdo
      const p = document.createElement("span");
      p.className = "memory-text";
      p.textContent = memory;
      memoryDiv.appendChild(p);
      
      // Icono de editar
      const editIcon = document.createElement("span");
      editIcon.className = "icon edit-icon";
      editIcon.textContent = "✎";
      memoryDiv.appendChild(editIcon);
      
      // Icono de borrar
      const deleteIcon = document.createElement("span");
      deleteIcon.className = "icon delete-icon";
      deleteIcon.textContent = "🗑";
      memoryDiv.appendChild(deleteIcon);
      
      container.appendChild(memoryDiv);
      
      // Funcionalidad para borrar: elimina el recuerdo y actualiza localStorage
      deleteIcon.addEventListener("click", () => {
        memories.splice(memIndex, 1);
        localStorage.setItem(`recuerdos_${entryIndex}`, JSON.stringify(memories));
        updateUserMemories(entryDiv, memories, entryIndex);
      });
      
      // Funcionalidad para editar:
      editIcon.addEventListener("click", () => {
        // Si no estamos en modo edición, se reemplaza el <span> por un <input>
        if (!memoryDiv.querySelector("input.edit-input")) {
          const input = document.createElement("input");
          input.type = "text";
          input.value = memory;
          input.className = "edit-input";
          memoryDiv.replaceChild(input, p);
          // Cambiar el icono de editar a guardar (puedes usar otro símbolo, aquí usamos 💾)
          editIcon.textContent = "💾";
        } else {
          // Guardar edición
          const input = memoryDiv.querySelector("input.edit-input");
          const newValue = input.value.trim();
          if (newValue !== "") {
            memories[memIndex] = newValue;
            localStorage.setItem(`recuerdos_${entryIndex}`, JSON.stringify(memories));
          }
          // Volver al modo de visualización
          const newSpan = document.createElement("span");
          newSpan.className = "memory-text";
          newSpan.textContent = memories[memIndex];
          memoryDiv.replaceChild(newSpan, input);
          editIcon.textContent = "✎";
        }
      });
    });
  }

  // Función para cargar los recuerdos guardados de cada entrada
  function cargarRecuerdos() {
    const entries = document.querySelectorAll(".entry");
    entries.forEach((entry, index) => {
      const key = `recuerdos_${index}`;
      const recuerdosGuardados = JSON.parse(localStorage.getItem(key)) || [];
      updateUserMemories(entry, recuerdosGuardados, index);
    });
  }

  // Función para guardar un nuevo recuerdo en una entrada
  function guardarRecuerdo(entry, entryIndex) {
    const textarea = entry.querySelector(".new-memory");
    const text = textarea.value.trim();
    if (text === "") return;
    const key = `recuerdos_${entryIndex}`;
    let memories = JSON.parse(localStorage.getItem(key)) || [];
    memories.push(text);
    localStorage.setItem(key, JSON.stringify(memories));
    updateUserMemories(entry, memories, entryIndex);
    textarea.value = "";
  }

  // Asocia la funcionalidad de guardar en cada entrada
  document.querySelectorAll(".entry").forEach((entry, index) => {
    const saveButton = entry.querySelector(".save-memory");
    saveButton.addEventListener("click", () => guardarRecuerdo(entry, index));
  });

  // Cargar recuerdos al iniciar la página
  cargarRecuerdos();
});
