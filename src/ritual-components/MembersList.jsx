import React, { useState, useEffect } from 'react';
import ritualClient from './client/ritual-client';
import Selector from '../app/organisms/navigation/Selector';
import { selectRoom } from '../client/action/navigation';

const MembersList = ({
  expertId,
  matrixIds,
  drawerPostie
}) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    console.log(`Expert : ${expertId}`);
    const members = async () => {
      const { data } = await ritualClient.get(`/v1/experts/${expertId}/members/`, {
        params: {},
      });
      setMembers(data);
    };
    members();
  });

  const renderedResults = () => {
    // console.log(members);
    // const joinIds = matrixIds.map((id) => {
    //   members.values('matrix_id').includes(id)
    // });
    // const joinIds = matrixIds.map((item, i) => ({ ...item, ...members[i] }));
    // console.log(joinIds);
    return matrixIds;
    // return member;
  };

  return renderedResults()
    .map((id) => (
      <>
        <Selector
          key={id}
          roomId={id}
          drawerPostie={drawerPostie}
          onClick={() => selectRoom(id)}
        />
      </>
    ));
};

export default MembersList;
