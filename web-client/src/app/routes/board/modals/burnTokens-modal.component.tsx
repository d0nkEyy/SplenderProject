import React, { useState } from "react";
import { Modal, ModalBody, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { gameSelector, isPossibleMove, resetMove } from "../../../actions/board.actions";
import { Action } from "../../../models/move";
import { addToast } from "../../../actions/toast.actions";
import { GemTypeString } from "../../../models/game-types";
import { getToken } from "../constants";
import { BaseModal, Props } from "./modal-base.component";

type BurnToken = {
    gems: { [s: string]: number }
}

export function BurnTokensModal(props: Props) {
    const name = "BurnToken";
    const dispatch = useDispatch();
    const gameState = useSelector(gameSelector);
    const [selectedTokens, setSelectedTokens] = useState<BurnToken>({
        gems: {},
    });

    function buildPayment(): Action {
        return {
            type: "BURN_TOKEN",
            value: selectedTokens
        }
    }

    function createToast(msg: string) {
        dispatch(addToast({ msg: msg, source: name }))
    }

    let modalInner = (
        <ModalBody>
            <Modal.Title>
                BurnTokens
            </Modal.Title>
            <Modal.Body style={{ display: "flex", flexWrap: "wrap" }}>
                {
                    Object.entries(gameState.game!.curPlayer.gems).map(([k, value]) => {
                        let key = k as GemTypeString;
                        const handler = (event: React.FormEvent<HTMLSelectElement>) => setSelectedTokens(payment => {
                            let value = Number((event.target as any).value);
                            let newObj = {
                                ...payment
                            };
                            newObj.gems[key] = value;
                            return {
                                gems: Object.entries(newObj.gems).reduce((agg, [gem, num]) => {
                                    if (num !== 0) {
                                        agg[gem] = num;
                                    }
                                    return agg;
                                }, {} as { [s: string]: number })
                            };
                        });
                        const defaults = selectedTokens === undefined || selectedTokens.gems[key] === undefined ? 0 : selectedTokens!.gems[key];
                        return (
                            <Form.Group className="mb-3" defaultValue={defaults} onChange={handler} style={{ display: "flex" }}>
                                <Form.Label>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        backgroundSize: "100% 100%",
                                        backgroundImage: `url(${getToken(props.service, key.toLowerCase())})`
                                    }} />
                                </Form.Label>
                                <Form.Select style={{ width: "auto" }}>
                                    {
                                        Array.apply(null, Array(value + 1)).map((_, index) => {
                                            return (
                                                <option value={index}>
                                                    {index}
                                                </option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                        )
                    })
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.onSuccess(buildPayment())}>
                    Burn!
                </Button>
            </Modal.Footer>
        </ModalBody>
    )

    return (
        <BaseModal {...props} inner={modalInner} name={name}/>
    )
}