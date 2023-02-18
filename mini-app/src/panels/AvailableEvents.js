import React from 'react';
import PropTypes from 'prop-types';

import { Div, Group, Panel, PanelHeader, PanelHeaderBack, SimpleCell, Title, Header, InfoRow, Button } from '@vkontakte/vkui';

import persik from '../img/persik.png';
import './Persik.css';

const AvailableEvents = props => {
    const events = [{name: "maybe", desc:"wtf", date: Date()}, {name: "dora", desc:"dura", date: Date()}];
    const getTicket = () => {

    };
    const listItems = events.map((d) =>
    <Group header={<Title level="1" style={{ marginBottom: 16 }}>{d.name}</Title>}>
        <img className="Persik" src={persik} alt="Persik The Cat"/>
        <Header>Информация о мероприятии</Header>
        <SimpleCell>
            <InfoRow header="Начало мероприятия">{d.date}</InfoRow>
        </SimpleCell>
        <SimpleCell>
            <InfoRow header="Описание">{d.desc}</InfoRow>
        </SimpleCell>
        <Button stretched size="l" onClick={getTicket}>
            Приобрести билет
        </Button>
    </Group>
    );

    return (<Panel id={props.id}>
		<PanelHeader
			before={<PanelHeaderBack onClick={props.go} data-to="home"/>}
		>
			Доступные мероприятия
		</PanelHeader>
        <Div>
            {listItems }
        </Div>

	</Panel>);
};

AvailableEvents.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default AvailableEvents;
