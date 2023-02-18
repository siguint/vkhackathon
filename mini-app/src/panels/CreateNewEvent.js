import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderBack, FormLayout, FormLayoutGroup, FormItem, Input, Button, Group,
    Textarea, Calendar } from '@vkontakte/vkui';

const CreateNew = props => {
    const [events, setEvents] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState(() => new Date());
    const addNewEvent = () => {
        const new_event = {name, description, value};
        const new_events = [...events, new_event];
        setEvents(new_events);
        console.log(events);

        //connection with blockchain and DB
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                before={<PanelHeaderBack onClick={props.go} data-to="home"/>}
            >
                Создать новое мероприятие
            </PanelHeader>
            <Group>
            <FormLayout>
                <FormLayoutGroup mode="vertical">
                <FormItem top="Название мероприятия" onChange={(e)=> setName(e.target.value)}>
                    <Input  />
                </FormItem>
                <FormItem top="Описание" onChange={(e)=> setDescription(e.target.value)}>
                    <Textarea />
                </FormItem>
                <FormItem top="Выбранная дата">
                {("0" + value.getDate()).slice(-2) + "-" + ("0"+(value.getMonth()+1)).slice(-2) + "-" +
                      value.getFullYear() + " " + ("0" + value.getHours()).slice(-2) + ":" +
                    ("0" + value.getMinutes()).slice(-2)}
                </FormItem>
                <FormItem>
                    <Calendar
                        value={value}
                        onChange={setValue}
                        enableTime={true}
                        disablePast={true}
                    />
                </FormItem>
                </FormLayoutGroup>
            </FormLayout>
            <Button stretched size="l" onClick={addNewEvent} >
				Создать
			</Button>
            </Group>
        </Panel>
    );
};

CreateNew.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default CreateNew;
