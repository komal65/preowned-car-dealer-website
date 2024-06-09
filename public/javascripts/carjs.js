document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('carForm');
        
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          
          
          alert('Car submitted successfully!');
          
        });
      });


      

      