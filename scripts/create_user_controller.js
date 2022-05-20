document.querySelector('#create-button').addEventListener('click', (e) => {
    //checking values
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const name = document.querySelector('#name').value;
            fetch('/create', {
                method: 'POST',
                headers: {
                    // Authorization: 'key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                    name
                }),
            })
                .then((res) => {
                    return res.json();
                }).then((res) =>{
                    //if status is success, user is redirect
                    if(res.retStatus === 'success'){
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        
                        Toast.fire({
                            icon: 'success',
                            title: 'Created successfully',
                            text: 'You are going to be redirected to login.'
                        }).then(()=> {
                            if (res.redirectTo && res.msg == 'main home') {
                                window.location = '/login';
                            }                   
                        })
                    }else{
                        alert(res.msg);
                    }
                })
            });
