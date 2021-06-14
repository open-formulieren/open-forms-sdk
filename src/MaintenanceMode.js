import Body from "./Body";
import Card from "./Card";


const MaintenanceMode = ({ title }) => {
  return (
    <Card title={title}>
      <Body>
        This form is currently undergoing maintenance and can not be accessed at the moment.
      </Body>
    </Card>
  )
};

export default MaintenanceMode;
