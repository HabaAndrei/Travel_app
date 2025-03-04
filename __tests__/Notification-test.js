import Notification from "../Components/Notification";
import { render, fireEvent } from '@testing-library/react-native';


it('renders correctly', () => {
  const { getByText } = render(<Notification notification={[{ id: 1, mes: 'Test Message', type: 'info' }]} />);
  expect(getByText('Test Message')).toBeTruthy();
});


it('renders the correct number of notifications', () => {
  const notifications = [
    { id: 1, mes: 'First', type: 'info' },
    { id: 2, mes: 'Second', type: 'info' }
  ];
  const { getAllByText } = render(<Notification notification={notifications} />);
  const data = getAllByText(/First|Second/);
  console.log(data);
  expect(getAllByText(/First|Second/).length).toBe(2);
});


it('removes notification on close press', () => {
  const notifications = [{ id: 1, mes: 'First', type: 'info' }];
  const setNotification = jest.fn();

  const { getByTestId } = render(
    <Notification notification={notifications} setNotification={setNotification} />
  );

  const closeButton = getByTestId('close-button-1');

  fireEvent.press(closeButton);

  expect(setNotification).toHaveBeenCalledTimes(1);
});


it('matches snapshot', () => {
  const tree = render(<Notification notification={[{ id: 1, mes: 'Snapshot', type: 'info' }]} />).toJSON();
  expect(tree).toMatchSnapshot();
});
