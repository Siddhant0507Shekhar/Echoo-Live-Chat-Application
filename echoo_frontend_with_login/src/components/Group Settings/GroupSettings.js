import React from 'react'
import { useEffect } from 'react';
import './GroupSettings.css';
import Searchicon from "../../media/search-icon.svg";

const GroupSettings = (props) => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];

    useEffect(() => {
        fetch('/api/groups-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            // body: JSON.stringify({username: props.username }),
            body: JSON.stringify({ username: window.UserName }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("I am inside the data")
                const allGroupsInfo = document.getElementById('allGroupsInfo');
                while (allGroupsInfo.childElementCount > 1) {
                    allGroupsInfo.removeChild(allGroupsInfo.lastChild);
                }
                console.log(data);
                data.forEach((group) => {
                    // top most Parent
                    const groupDiv = document.createElement('div');
                    groupDiv.classList.add('allgrp_div', group.Access_key);
                    groupDiv.classList.add('allgrp_div')
                    // First child starts
                    const groupDetailsDiv = document.createElement('div');
                    groupDetailsDiv.classList.add('allgrp_div_details');

                    const groupName = document.createElement('div');
                    groupName.textContent = group.groupName;

                    const createdBy = document.createElement('div');
                    createdBy.textContent = group.createdBy;

                    const button = document.createElement('button');
                    button.textContent = group.isJoined ? 'Exit' : 'Join';
                    button.className = group.isJoined ? 'joined' : 'notjoined';
                    button.id = group.groupName;
                    button.addEventListener('click', handleClickJoin);
                    groupDetailsDiv.appendChild(groupName);
                    groupDetailsDiv.appendChild(createdBy);
                    groupDetailsDiv.appendChild(button);
                    groupDiv.appendChild(groupDetailsDiv);
                    // First child appended successfully




                    // Second child of top most component
                    const editDiv = document.createElement('div');
                    editDiv.classList.add('edit');

                    // first child of second child of top most component
                    const editFirstChildDiv = document.createElement('div');
                    editFirstChildDiv.classList.add('edit-first-child');
                    editFirstChildDiv.classList.add(group.Access_key);


                    //form
                    const form = document.createElement('form');
                    form.classList.add(group.Access_key);
                    // Add users
                    const addUsersLabel = document.createElement('label');
                    addUsersLabel.htmlFor = 'addingUsers';
                    addUsersLabel.textContent = 'Add Users:';
                    // Select item of form
                    const select = document.createElement('select');
                    select.classList.add('users-to-add');
                    select.name = 'add_users';
                    select.multiple = true;
                    select.required = true;
                    form.appendChild(addUsersLabel);
                    form.appendChild(select);
                    const adduserbutton = document.createElement('button');
                    adduserbutton.innerText = 'ADD';
                    adduserbutton.id = group.Access_key;
                    adduserbutton.addEventListener('click', handleAddUsers);
                    form.appendChild(adduserbutton);
                    // form made completely

                    //delete-group button
                    const deleteGroupButton = document.createElement('button');
                    deleteGroupButton.id = 'deletegroup';
                    deleteGroupButton.classList.add(group.Access_key);
                    deleteGroupButton.textContent = 'Delete Group';
                    deleteGroupButton.addEventListener('click', handleClickDeleteGroup);
                    // delete group button made completely

                    const dsedf = document.createElement('div');
                    const edsf = document.createElement('div');
                    dsedf.appendChild(form);
                    edsf.appendChild(deleteGroupButton);

                    editFirstChildDiv.appendChild(dsedf);
                    editFirstChildDiv.appendChild(edsf);




                    //Dropdown-icon-row  --> second child of edit div
                    const dropdownIconRowDiv = document.createElement('div');
                    dropdownIconRowDiv.classList.add('dropdown-icon-row');

                    const dropdownIconDiv = document.createElement('div');
                    dropdownIconDiv.classList.add('dropdown-icon');
                    dropdownIconDiv.id = group.Access_key;
                    dropdownIconDiv.addEventListener('click', toggledropdown);

                    const dropdownLine1Div = document.createElement('div');
                    dropdownLine1Div.classList.add('dropdown-line1');
                    dropdownLine1Div.id = group.Access_key;
                    const dropdownLine2Div = document.createElement('div');
                    dropdownLine2Div.classList.add('dropdown-line2');
                    dropdownLine2Div.id = group.Access_key;
                    dropdownIconDiv.appendChild(dropdownLine1Div);
                    dropdownIconDiv.appendChild(dropdownLine2Div);

                    dropdownIconRowDiv.appendChild(dropdownIconDiv);
                    //Dropdown-icon-row made completely

                    editDiv.appendChild(editFirstChildDiv);
                    editDiv.appendChild(dropdownIconRowDiv);

                    // groupDiv.appendChild(groupDetailsDiv);
                    groupDiv.appendChild(editDiv);

                    allGroupsInfo.appendChild(groupDiv);
                })
            }
            )
            .catch((error) => {
                console.log(error);
            });
    });

    const handleClickJoin = (e) => {
        const group_name = e.target.id;
        console.log(e.target.id);
        fetch('/api/toggle-user-inGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username: window.UserName, groupName: group_name }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(e.target.className);
                if (e.target.className === 'joined') {
                    e.target.className = 'notjoined';
                    e.target.innerText = 'Join';
                } else {
                    e.target.className = 'joined';
                    e.target.innerText = 'Exit';
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        const form = e.target;
        const groupName = form.elements.groupName.value;
        const participants = Array.from(form.elements.participants.options)
            .filter((option) => option.selected)
            .map((option) => option.value);

        const formData = {
            groupName: groupName,
            participants: participants,
            createdBy: window.UserName
        };

        fetch('/api/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the backend
                const message_div = document.getElementById("message_created");
                message_div.innerText = data.message;
                const form = document.querySelector('#form_createGroup form');
                form.reset();
                setTimeout(() => {
                    message_div.innerText = ""
                }, 2000);

            })
            .catch((error) => {
                // Handle any errors
                const message_div = document.getElementById("message_created");
                message_div.innerText = error.message;
                const form = document.querySelector('#form_createGroup form');
                form.reset();
                setTimeout(() => {
                    message_div.innerText = "";
                }, 2000);
            });
    };



    const onchangesearch = (e) => {
        const val = e.target.value;
        const allGroups = document.querySelectorAll(".allgrp_div");
        const groupNames = document.querySelectorAll(".allgrp_div_details div:first-child");
        if (val === "" || val.length === 0) {
            for (let i = 1; i < allGroups.length; i++) {
                // Show all groups
                allGroups[i].classList.remove("display_off");
            }
        } else {
            for (let i = 1; i < allGroups.length; i++) {
                if (val === (groupNames[i].innerText).substr(0, val.length)) {
                    allGroups[i].classList.remove("display_off");
                } else {
                    allGroups[i].classList.add("display_off");
                }
            }
        }
    };
    const onclickcreateGrp = () => {
        const create_form = document.querySelector("#form_createGroup");
        create_form.classList.toggle("display_off");

        if (!create_form.classList.contains("display_off")) {
            fetch('/api/users')
                .then((response) => response.json())
                .then((data) => {
                    const select_item = document.getElementById("participants");
                    select_item.innerHTML = ''; // Clear previous options
                    console.log(data);
                    for (let i = 0; i < data.users.length; i++) {
                        console.log(data.users[i])
                        const option_item = document.createElement('option');
                        option_item.value = data.users[i];
                        option_item.innerText = data.users[i];
                        select_item.appendChild(option_item);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const loadUsers = (accessKey) => {
        const form = document.querySelector(`form.${accessKey}`);
        const selectElement = form.querySelector('select.users-to-add');
        selectElement.innerHTML = "";

        fetch('/api/get_users_not_in_group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ 'Access_key': accessKey }),
        })
            .then((response) => response.json())
            .then((data) => {
                data.forEach((user) => {
                    const option = document.createElement('option');
                    option.value = user.username;
                    option.innerText = user.username;
                    selectElement.appendChild(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleClickDeleteGroup = (e) => {
        const accessKey = e.target.className;

        fetch('/api/delete-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ 'Access_key': accessKey }),
        })
            .then((response) => {
                // Group deleted successfully
                console.log("GROUP IS DELETED");
                const delete_div = document.querySelector(`.${accessKey}.allgrp_div`)
                delete_div.remove();
                console.log('Group deleted');
            })
            .catch((error) => {
                // Handle error
                console.error('Error deleting group:', error);
            });
    };

    const toggledropdown = (e) => {
        // const edit_firstchild = document.getElementsByClassName('edit-first-child')[0];
        const edit_firstchild = document.querySelector(`.edit-first-child.${e.target.id}`)
        const line1 = document.querySelector(`#${e.target.id} .dropdown-line1`);
        const line2 = document.querySelector(`#${e.target.id} .dropdown-line2`);

        if (edit_firstchild.style.display === "grid") {
            edit_firstchild.style.display = "none";
            line1.style.transform = "rotate(45deg)";
            line2.style.transform = "rotate(-45deg)";
            window.scrollBy(0, -100);
        } else {
            edit_firstchild.style.display = "grid";
            line1.style.transform = "rotate(-45deg)";
            line2.style.transform = "rotate(45deg)";
            window.scrollBy(0, 100);
            loadUsers(e.target.id);
        }
    };

    const handleAddUsers = (e) => {
        e.preventDefault(); // Prevent form submission

        const form = document.querySelector(`form.${e.target.id}`);
        const selectElement = form.querySelector('.users-to-add');
        const selectedOptions = Array.from(selectElement.selectedOptions);
        const accessKey = e.target.id;

        const selectedUsers = selectedOptions.map((option) => option.value);

        const requestBody = {
            users: selectedUsers,
            accessKey: accessKey,
        };

        fetch('/api/add-users-to-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.ok) {
                    // Success
                    console.log('Users added to group successfully!');
                } else {
                    // Error
                    console.error('Failed to add users to group.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };



    return (
        <div id='grpsettings'>
            <div id='create'>
                <button id='create_button' onClick={onclickcreateGrp}>
                    <div>+</div>
                    <div id='create_grp'>Create Group</div>
                </button>
                <div id='form_createGroup' className='display_off'>
                    <form onSubmit={handleSubmit1} >
                        <div id='message_created'></div>
                        <label htmlFor="groupName">Group Name:</label>
                        <input type="text" id="groupName" name="groupName" required />
                        <label htmlFor="participants">Participants:</label>
                        <select id="participants" name="participants" multiple required>

                        </select>

                        <button type="submit">Create Group</button>
                    </form>

                </div>

            </div>
            <div id='search_grp'>
                <div id='search_bar'>
                    <input onChange={onchangesearch} type='text' placeholder='Search Group' />
                    <img src={Searchicon} alt='Searchicon' />
                </div>
            </div>
            <div id='allGroupsInfo'>
                <div id='head_grpinfo' className='allgrp_div'>
                    <div className='allgrp_div_details'>
                        <div>Group Name</div>
                        <div>Created By</div>
                        <div>Status</div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default GroupSettings;