document.querySelector('#login-button').addEventListener('click', (e) => {
    //checking values
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
            fetch('/login', {
                method: 'POST',
                headers: {
                    // Authorization: 'key',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })
                .then((res) => {
                    return res.json();
                }).then((res) =>{
                    //if status is success, user is redirect
                    if(res.retStatus === 'success'){
                        if (res.redirectTo && res.msg == 'home') {
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
                                title: 'Login successfully',
                                text: 'You are going to be redirected to your home.'
                            }).then(() => {
                                window.location.assign('/home');

                            })
                        }
                    }else{
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        })               
                        Toast.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.msg
                        })
                    }
                })
            });